// Exploring Sentinel-1 SAR Backscatter for Forest Disturbance Monitoring
// Exploratory comparison around Jasper, Alberta, Canada.
// NOTE: AOI is a demonstration rectangle, NOT an official wildfire perimeter.
// Results are area-wide and do not prove that wildfire caused observed changes.

var aoi = ee.Geometry.Rectangle([-118.15, 52.75, -117.55, 53.15]);
Map.centerObject(aoi, 9);
Map.addLayer(aoi, {color: 'yellow'}, 'Study area (demonstration rectangle)', false);

var preStart = '2024-06-01';
var preEnd   = '2024-07-16';
var postStart = '2024-09-01';
var postEnd   = '2024-10-16';

function getS1(start, end) {
  return ee.ImageCollection('COPERNICUS/S1_GRD')
    .filterBounds(aoi)
    .filterDate(start, end)
    .filter(ee.Filter.eq('instrumentMode', 'IW'))
    .filter(ee.Filter.listContains('transmitterReceiverPolarisation', 'VV'))
    .filter(ee.Filter.listContains('transmitterReceiverPolarisation', 'VH'))
    .select(['VV', 'VH']);
}

var s1PreCol = getS1(preStart, preEnd);
var s1PostCol = getS1(postStart, postEnd);
print('Sentinel-1 pre-event scene count', s1PreCol.size());
print('Sentinel-1 post-event scene count', s1PostCol.size());

var s1Pre = s1PreCol.median().clip(aoi);
var s1Post = s1PostCol.median().clip(aoi);
var vvChange = s1Post.select('VV').subtract(s1Pre.select('VV')).rename('VV_change_dB');
var vhChange = s1Post.select('VH').subtract(s1Pre.select('VH')).rename('VH_change_dB');

var sarVis = {min: -25, max: 0};
Map.addLayer(s1Pre.select('VV'), sarVis, 'S1 pre VV (dB)', false);
Map.addLayer(s1Post.select('VV'), sarVis, 'S1 post VV (dB)', false);
Map.addLayer(s1Pre.select('VH'), sarVis, 'S1 pre VH (dB)', false);
Map.addLayer(s1Post.select('VH'), sarVis, 'S1 post VH (dB)', false);
Map.addLayer(vvChange, {min: -5, max: 5, palette: ['08306b', 'f7f7f7', '67000d']}, 'VV change: post minus pre');
Map.addLayer(vhChange, {min: -5, max: 5, palette: ['08306b', 'f7f7f7', '67000d']}, 'VH change: post minus pre');

function maskS2(img) {
  var scl = img.select('SCL');
  var mask = scl.neq(3).and(scl.neq(8)).and(scl.neq(9))
    .and(scl.neq(10)).and(scl.neq(11));
  return img.updateMask(mask).divide(10000)
    .copyProperties(img, ['system:time_start']);
}
function getS2(start, end) {
  return ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED')
    .filterBounds(aoi)
    .filterDate(start, end)
    .filter(ee.Filter.lte('CLOUDY_PIXEL_PERCENTAGE', 80))
    .map(maskS2)
    .map(function(img) {
      return img.normalizedDifference(['B8', 'B4']).rename('NDVI')
        .copyProperties(img, ['system:time_start']);
    });
}

var s2PreCol = getS2(preStart, preEnd);
var s2PostCol = getS2(postStart, postEnd);
print('Sentinel-2 pre-event scene count', s2PreCol.size());
print('Sentinel-2 post-event scene count', s2PostCol.size());

var ndviPre = s2PreCol.median().clip(aoi).rename('NDVI_pre');
var ndviPost = s2PostCol.median().clip(aoi).rename('NDVI_post');
var ndviChange = ndviPost.subtract(ndviPre).rename('NDVI_change');

Map.addLayer(ndviPre, {min: 0, max: 0.8, palette: ['8c510a', 'f6e8c3', '01665e']}, 'S2 pre NDVI', false);
Map.addLayer(ndviPost, {min: 0, max: 0.8, palette: ['8c510a', 'f6e8c3', '01665e']}, 'S2 post NDVI', false);
Map.addLayer(ndviChange, {min: -0.5, max: 0.5, palette: ['a50026', 'ffffbf', '006837']}, 'NDVI change: post minus pre');

var scale = 20;
function printMean(label, image) {
  var stats = image.reduceRegion({
    reducer: ee.Reducer.mean(),
    geometry: aoi,
    scale: scale,
    maxPixels: 1e9,
    bestEffort: true
  });
  print(label, stats);
}
printMean('Mean VV pre (dB)', s1Pre.select('VV'));
printMean('Mean VV post (dB)', s1Post.select('VV'));
printMean('Mean VV change (dB)', vvChange);
printMean('Mean VH pre (dB)', s1Pre.select('VH'));
printMean('Mean VH post (dB)', s1Post.select('VH'));
printMean('Mean VH change (dB)', vhChange);
printMean('Mean NDVI pre', ndviPre);
printMean('Mean NDVI post', ndviPost);
printMean('Mean NDVI change', ndviChange);
