layer = qgis.utils.iface.activeLayer()
value = layer.featureCount()

# name = layer.id()
mc = qgis.utils.iface.mapCanvas()
currentLayer = mc.currentLayer()
name = currentLayer.name()

msg = ''
if not currentLayer.isValid():
    msg = 'Error! No layer selected!!!'
else:
    msg = "The layer '{}' featureCount is {}!".format(name, value)
    
qgis.utils.iface.messageBar().pushMessage(msg)

# crs = currentLayer.sourceCrs().toWkt()
# print(currentLayer.sourceCrs().authid())