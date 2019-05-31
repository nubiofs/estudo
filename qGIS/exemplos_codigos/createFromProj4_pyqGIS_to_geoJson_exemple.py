from qgis.core import *
import qgis.utils
import os, sys

reload(sys)  # Reload does the trick!
sys.setdefaultencoding('big5')

qgs = QgsApplication(sys.argv, False)

name = sys.argv[2].decode("big5")
crsNumber = int(sys.argv[3].decode("big5"))

# load providers
qgs.initQgis()
layer = QgsVectorLayer(sys.argv[1].decode("big5"), "newLayer", "ogr")
if crsNumber != 4326:
	crs = layer.crs()
	crs.createFromId(crsNumber)
	layer.setCrs(crs)

layer.setProviderEncoding(u'big5')
layer.dataProvider().setEncoding(u'big5')

if not layer.isValid():
  print("Layer failed to load!")

else:
    print ("Layer was loaded successfully!")

DirPath = "E:/xampp/htdocs/drive/s3pool"
# export layer to shape
crsSrc = QgsCoordinateReferenceSystem(4326, QgsCoordinateReferenceSystem.EpsgCrsId)

# layer crs to 4326
if "USER" in layer.crs().authid() or layer.crs().authid()  == "":
    _writer = qgis.core.QgsVectorFileWriter.writeAsVectorFormat(layer,DirPath+"/"+name+".shp","utf-8",crsSrc,"ESRI Shapefile")
# TWD97 layer to 4326
elif layer.crs().authid()  == "EPSG:3825" or layer.crs().authid()  == "EPSG:3826":
    crs = layer.crs()
    crs.createFromProj4("+proj=tmerc +lat_0=0 +lon_0=121 +k=0.9999 +x_0=250000 +y_0=0 +ellps=GRS80 +units=m +no_defs")
    layer.setCrs(crs)
    _writer = qgis.core.QgsVectorFileWriter.writeAsVectorFormat(layer,DirPath+"/"+name+".shp","utf-8",crsSrc,"ESRI Shapefile")
# TWD67 layer to 4326
elif layer.crs().authid()  == "EPSG:3827" or layer.crs().authid()  == "EPSG:3828":
    crs = layer.crs()
    crs.createFromProj4("+proj=tmerc +ellps=GRS67 +towgs84=-752,-358,-179,-.0000011698,.0000018398,.0000009822,.00002329 +lon_0=121 +x_0=250000 +k=0.9999 +to +proj=tmerc +datum=WGS84 +lon_0=121 +x_0=250000 +k=0.9999")
    layer.setCrs(crs)
    _writer = qgis.core.QgsVectorFileWriter.writeAsVectorFormat(layer,DirPath+"/"+name+".shp","utf-8",crsSrc,"ESRI Shapefile")
else:
    _writer = qgis.core.QgsVectorFileWriter.writeAsVectorFormat(layer,DirPath+"/"+name+".shp","utf-8",crsSrc,"ESRI Shapefile")

# qgs.exitQgis()
