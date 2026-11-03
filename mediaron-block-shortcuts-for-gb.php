<?php
/**
 * Plugin Name:       MediaRon Block Shortcuts for GenerateBlocks
 * Description:       A collection of enhancements for the GenerateBlocks plugins.
 * Version:           1.1.0
 * Requires at least: 7.0
 * Requires PHP:      8.2
 * Author:            Ronald Huereca
 * License:           GPL v2 or later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       mediaron-block-shortcuts-for-gb
 * Requires Plugins: generateblocks
 *
 * @package MRShortcutsGB
 */

namespace MRShortcutsGB;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'MRSHORTCUTSGB_VERSION', '1.1.0' );
define( 'MRSHORTCUTSGB_FILE', __FILE__ );

// Support for site-level autoloading.
if ( file_exists( __DIR__ . '/lib/autoload.php' ) ) {
	require_once __DIR__ . '/lib/autoload.php';
}

/**
 * MRShortcutsGB class.
 */
class MRShortcutsGB {

	/**
	 * Holds the class instance.
	 *
	 * @var MRShortcutsGB $instance
	 */
	private static $instance = null;

	/**
	 * Return an instance of the class.
	 *
	 * @since 1.0.0
	 *
	 * @return MRShortcutsGB class instance.
	 */
	public static function get_instance() {
		if ( null === self::$instance ) {
			self::$instance = new self();
		}
		return self::$instance;
	}

	/**
	 * Class initializer.
	 */
	public function plugins_loaded() {

		Blocks::run();

		$admin = new Admin();
		$admin->run();

		$admin_bar = new Admin_Bar();
		$admin_bar->run();

		/**
		 * When MRShortcutsGB can be extended.
		 *
		 * Filter when MRShortcutsGB can be extended.
		 *
		 * @since 1.0.0
		 */
		do_action( 'mrshortcutsgb_loaded' );
	}

	/**
	 * Init all the things.
	 */
	public function init() {

		// Nothing here yet.
	}
}

add_action(
	'plugins_loaded',
	function () {
		$gb = MRShortcutsGB::get_instance();
		$gb->plugins_loaded();
	}
);
