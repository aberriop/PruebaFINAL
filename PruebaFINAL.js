require(["esri/map",
    "dojo/on",
    'dojo/dom',
    "esri/layers/FeatureLayer",
    "esri/geometry/Extent",
    "esri/tasks/query",
    "dojo/ready",
    "esri/config",
    "esri/tasks/ServiceAreaTask", "esri/tasks/ServiceAreaParameters", "esri/tasks/FeatureSet",
    "esri/symbols/SimpleMarkerSymbol", "esri/symbols/SimpleLineSymbol", "esri/symbols/SimpleFillSymbol",
    "esri/geometry/Point", "esri/graphic",
    "dojo/parser", "dojo/dom", "dijit/registry",
    "esri/Color", "dojo/_base/array",
    "dojo/domReady!"
],
    function (
        Map,
        on,
        dom,
        FeatureLayer,
        Extent,
        Query,
        ready,
        esriConfig,
        ServiceAreaTask, ServiceAreaParameters, FeatureSet,
        SimpleMarkerSymbol, SimpleLineSymbol, SimpleFillSymbol,
        Point, Graphic,
        parser, dom, registry,
        Color, arrayUtils) {

        ready(function () {
            parser.parse();


            var map = new Map("divMap", {
                basemap: "streets-vector",
                center: [-3.693794, 40.422260],
                zoom: 10
            });

            var centrosSalud = new FeatureLayer("https://services3.arcgis.com/2aFloSmRnbHXXRIn/ArcGIS/rest/services/CENTROS_SALUD/FeatureServer/0");
            map.addLayer(centrosSalud);

            function fServiceAreaTask() {

                var query = new Query();
                query.where = "1=1";
                centrosSalud.selectFeatures(query, FeatureLayer.SELECTION_NEW);

                centrosSalud.selectFeatures(query, FeatureLayer.SELECTION_NEW, function (seleccion) {

                    map.graphics.clear();

                    var centroS = new FeatureSet();
                    centroS.features = seleccion;

                    ServiceAreaTask = new ServiceAreaTask("https://formacion.esri.es/server/rest/services/RedMadrid/NAServer/Service%20Area");


                    params = new ServiceAreaParameters();
                    params.outSpatialReference = map.spatialReference;
                    params.returnFacilities = false;
                    params.impedanceAttribute = "TiempoPie";
                    params.facilities = centroS;


                    params.defaultBreaks = [3];

                    ServiceAreaTask.solve(params, function (resultado) {
                        console.log("resultados", resultado);

                        var polygonSymbol = new SimpleFillSymbol(
                            "solid",
                            new SimpleLineSymbol("solid", new Color([255, 255, 255]), 1),
                            new Color([255, 0, 0, 0.25])
                        );

                        dojo.forEach(resultado.serviceAreaPolygons, function (serviceArea) {
                            serviceArea.setSymbol(polygonSymbol);
                            map.graphics.add(serviceArea);
                        });


                    });
                });
            };
        });
    });
