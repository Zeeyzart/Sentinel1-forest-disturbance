# Exploring Sentinel-1 SAR Backscatter for Forest Disturbance Monitoring

**Environmental remote sensing | Google Earth Engine**

## Overview
This exploratory project compares Sentinel-1 C-band SAR backscatter (VV and VH) with Sentinel-2 NDVI around Jasper, Alberta, Canada, across pre-event and post-event windows in 2024.

**Research question:** How did mean radar backscatter and optical vegetation greenness differ between the selected pre-event and post-event periods?

This is an initial area-wide comparison. The study rectangle is a demonstration area, not an official wildfire perimeter. Results should not be interpreted as a validated estimate of wildfire impacts.

## Data and tools
- Sentinel-1 GRD: `COPERNICUS/S1_GRD`
- Sentinel-2 Surface Reflectance Harmonized: `COPERNICUS/S2_SR_HARMONIZED`
- Google Earth Engine Code Editor
- Date windows: 1 June–15 July 2024 (pre-event) and 1 September–15 October 2024 (post-event)
- Study area: rectangular area around Jasper, Alberta, Canada

## Results

| Indicator | Pre-event mean | Post-event mean | Change in pixel-wise difference layer |
|---|---:|---:|---:|
| Sentinel-1 VV backscatter (dB) | -6.890 | -6.512 | +0.319 dB |
| Sentinel-1 VH backscatter (dB) | -13.737 | -13.130 | +0.558 dB |
| Sentinel-2 NDVI | 0.499 | 0.370 | -0.128 |

Scene counts:
- Sentinel-1: 7 pre-event scenes and 8 post-event scenes
- Sentinel-2: 11 pre-event scenes and 14 post-event scenes

**Note on VV:** the difference between the two separately reported mean composites is about +0.377 dB, while the mean of the pixel-wise VV difference layer is +0.319 dB. These values can differ when the composites have different valid-pixel masks. A common-pixel comparison is needed before interpreting them as directly comparable summaries.

## Interpretation
Mean VV and VH backscatter became slightly less negative in the post-event composite, while mean NDVI decreased. The lower NDVI is consistent with reduced vegetation greenness in the post-event composite. SAR and optical sensors respond to different surface properties, so their directions of change need not match.

These results are descriptive and exploratory. The analysis does not isolate the official burned perimeter or compare burned pixels with unburned controls. Changes may reflect seasonality, surface moisture, acquisition geometry, terrain, mixed burned/unburned pixels, and other factors. The results do not establish that the wildfire caused the observed differences.
