# /wp-content/themes/iris/inc/map.php

<?php
//map scripts and styles
function map_scripts() {
	if (is_front_page()) {
		wp_enqueue_style('leaflet-css', get_template_directory_uri() . '/assets/vendor/leaflet/libs/leaflet.css');
		wp_enqueue_style('leaflet-markers-css', get_template_directory_uri() . '/assets/vendor/leaflet/libs/MarkerCluster.css');
		wp_enqueue_style('map-style', get_template_directory_uri() . '/assets/vendor/leaflet/style.css');

		wp_enqueue_script('leaflet-js', get_template_directory_uri() . '/assets/vendor/leaflet/libs/leaflet.js');
		wp_enqueue_script('leaflet-yandex-js', get_template_directory_uri() . '/assets/vendor/leaflet/libs/Yandex.js');
		wp_enqueue_script('leaflet-markercluster-js', get_template_directory_uri() . '/assets/vendor/leaflet/libs/leaflet.markercluster.js');
		wp_enqueue_script('maps-js', get_template_directory_uri() . '/assets/vendor/leaflet/index.js');
	}
}
add_action('wp_enqueue_scripts', 'map_scripts');

//shortcode
function iris_map($atts) {

	ob_start();

	get_template_part('template-parts/map');

	return ob_get_clean();

}
add_shortcode('map', 'iris_map');

?>