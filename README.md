# gazetteer
The app will be mobile first but will also suit large devices/pc. This is a one page application.

The layout will be a map overlayed with easy buttons, and the function to zoom in and out.

When opening the app you are taken to your current position.

There will be a drop down select bar for you to select an alternative country. The area you are currently in, or have selected is indicated by a polygon border. 

The map will be scrollable but the viewport will be static.
 
There will be buttons overlaying the map to reveal the following information:
• Country name / Capital city
• Population
• Currency / current exchange rate
• Current weather / weather forecast
• Wikipedia links

Requests to external API’s for this information will be done using PHP cURL commands.

The country codes data within the file countryborders.geo.json will be used as key to find the name of the selected country.

This file also contains the data for each country to create a highlighted polygon around each selected area.

AJAX calls with Javascript and jQuery will be used to render the information to the HTML.

I will use bootstrap library to assist with the design.

Leaflet.EasyMarker is a Leaflet plugin that simplifies the process of adding markers to a map. It allows you to easily create and customize markers with icons, popups, and tooltips. I plan on using this tool to add markers to the map indicating the location of various points of interest.

Leaflet.MarkerCluster is another Leaflet plugin that provides clustering functionality for large sets of markers. It groups nearby markers together into clusters, making it easier to visualize and interact with large numbers of markers on a map. I plan on using this tool to cluster markers that are in close proximity to each other, providing a more user-friendly experience and preventing the map from becoming cluttered.

In addition to these tools, I may also consider using other Leaflet plugins or libraries, such as Leaflet.draw, which provides tools for drawing shapes on the map.

Overall, my plan is to use a combination of these tools to create an interactive and visually appealing map that displays relevant points of interest and provides a user- friendly experience for exploring the area.


 
