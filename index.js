// import * as L1 from 'leaflet';
// import { Icon } from 'leaflet';
// import 'leaflet.markercluster/dist/leaflet.markercluster';

// import "leaflet-plugins/layer/tile/Yandex";
// import "leaflet-plugins/layer/tile/Yandex.addon.LoadApi";
// import "leaflet-plugins/layer/tile/Yandex.addon.Controls";



// //
// // HOW TO SETUP:
// //
// // _icons: descibe all the icons on the map
// // iconCreateFunction: create cluster icon. Rewrite it to show what inside of cluser
// // sidebarTemplate: template of sidebar 
//


var _icons = {
  // icon for marker cluster group
  big:   new L.divIcon({className: 'big-icon', iconSize: null}),
  type1: new L.divIcon({className: 'church-icon-one', iconSize: null}),
  type2: new L.divIcon({className: 'church-icon-two', iconSize: null}),
  type3: new L.divIcon({className: 'church-icon-three', iconSize: null}),
};


class churchMap {
  churchZoom = 8;

  constructor(churchArray) {
    this._churches = churchArray;

    const config = {
      minZoom: 4,
      maxZoom: 18,
      zoomControl: false,
      attributionControl: false, // don't remove it
    };

    this._map = L.map('map', config);
    var yandexLayer = new L.yandex();
    this._map.addLayer(yandexLayer);

    // control customisation
    L.control.zoom({
       position:'topright'
      }).addTo(this._map);

    this._initMarkers();

    // events to handle sidebar

    document.addEventListener("keydown", () => {
      event.target.blur();

      // close sidebar when press esc
      if (event.key === "Escape") {
        this.closeSidebar();
      }
    });

    // close sidebar when click on close button
    const buttonClose = document.querySelector(".close-button");
    buttonClose.addEventListener("click", () => {
      // close sidebar when click on close button
      this.closeSidebar();
    });
  }

  _initMarkers() {
    // create marker cluster group
    let markers = L.markerClusterGroup({
      showCoverageOnHover: false,
      maxClusterRadius: 10,
      zoomToBoundsOnClick: false,
      iconCreateFunction: function(cluster) {
          return _icons["big"];
      }
    });

    // create marker for every church
    this._churches.forEach((church, index) => {
      var marker = L.marker(
        [church.lat, church.lon], 
        {
          icon: _icons[church.type],
          "marker-options-id": index,
        });
      markers.addLayer(marker);
    });

    markers.on('clusterclick', function (a) {
      var bounds = a.layer.getBounds().pad(0.5);
      this._map.fitBounds(bounds);
    }.bind(this));

    // show sidebar on click
    markers.on("click", function (e) {
      if (e.layer instanceof L.Marker) {

        // zoom to church
        const newZoom = Math.max(this.churchZoom, this._map.getZoom());
        this._map.setView(e.layer.getLatLng(), newZoom);

        // deactivate previously activated icon
        this._deactivateIcon();
        e.layer._icon.classList.add('active-icon');
        this.showSidebarWidthText(e.layer.options["marker-options-id"]);
      }
    }.bind(this));

    // resize map to fit all markers
    this._map.fitBounds(markers.getBounds());
    this._map.addLayer(markers);
  }

  showSidebarWidthText(id) {
    const church = this._churches[id];

    document.body.classList.add("active-sidebar");

    const sidebarTemplate = `
        <div class="sidebar-content">
          <img class="sidebar-img" src="./img/destroyed.jpeg">
          <div class="sidebar-header">${church.name}</div>
          <div class="sidebar-description">${church.desc}</div>
        </div>
    `;

  
    const content = document.querySelector(".sidebar-content");

    // always remove content before adding new one
    content?.remove();

    // add content to sidebar
    document.querySelector(".sidebar").insertAdjacentHTML("beforeend", sidebarTemplate);
  }

  closeSidebar() {
    document.body.classList.remove("active-sidebar");
    this._deactivateIcon();
  }

  _deactivateIcon() {
    var activeIcon = document.querySelector(".active-icon");

    if (activeIcon) {
      activeIcon.classList.remove("active-icon");
    }
  }

};

window.initMap = function(Args) {
  return new churchMap(Args);
}
