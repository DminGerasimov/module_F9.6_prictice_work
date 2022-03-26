import os

from aiohttp import web
import aiohttp_cors


#Обработчик websokets
async def wshandler(request:web.Request):
    resp = web.WebSocketResponse()
    #available = resp.can_prepare(request)
    #if not available:
    #    with open(WS_FILE, "rb") as fp:
    #        return web.Response(body=fp.read(), content_type="text/html")

    await resp.prepare(request)
    await resp.send_str("Welcome!")

    try:
        print("Someone joined.")
        for ws in request.app["sockets"]:
            await ws.send_str("Someone joined")
        request.app["sockets"].append(resp)

        async for msg in resp:
            if msg.type==web.WSMsgType.TEXT:
                for ws in request.app["sockets"]:
                    if ws is not resp:
                        await ws.send_str(msg.data)
            else:
                return resp
        return resp

    finally:
        request.app["sockets"].remove(resp)
        print("Someone disconnected!")
        for ws in request.app["sockets"]:
            await ws.send_str("Someone disconnected.")

async def on_shutdown(app:web.Application):
    for ws in app["sockets"]:
        await ws.close()

# Обработчик POST сообщения для отправки его всем сокетам
async def newshandler(request:web.Request):
    if request.body_exists:
        newsMessage = await request.text()
        for ws in request.app["sockets"]:
            await ws.send_str(newsMessage)
        return web.Response(text='sent data:"' + newsMessage[:12] + '..."', status=200)
    return web.Response(text='null data sent to server or no connected websockets.', status=400)


def init():
    app = web.Application()
    app["sockets"] = []

    # настройка CORS для пути .../news
    cors = aiohttp_cors.setup(app)
    resource = cors.add(app.router.add_resource("/news"))
    cors.add(
        resource.add_route("POST", newshandler),
        {"*": aiohttp_cors.ResourceOptions(
            allow_credentials=True,
            expose_headers=("X-Custom-Server-Header",),
            allow_headers=("X-Requested-With", "Content-Type"),
            max_age=3600,
        )}
    )

    # роутер для вебсокетов
    app.router.add_get('/', wshandler)

    app.on_shutdown.append(on_shutdown)
    return app

app = init()
web.run_app(app)