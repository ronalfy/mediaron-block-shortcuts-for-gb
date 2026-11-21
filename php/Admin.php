<?php
/**
 * Admin class.
 *
 * @package MRShortcutsGB
 */

namespace MRShortcutsGB;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
/**
 * Admin class.
 */
class Admin {

	/**
	 * Class runner.
	 */
	public function run() {
		// Init the admin menu.
		add_action( 'admin_menu', array( $this, 'add_admin_menu' ), 1000 );

		// Enqueue scripts for the admin page.
		add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_scripts' ) );

		// For retrieving the options.
		add_action( 'wp_ajax_mrshortcutsgb_get_options', array( $this, 'ajax_get_options' ) );

		// For saving the options.
		add_action( 'wp_ajax_mrshortcutsgb_save_options', array( $this, 'ajax_save_options' ) );

		// For resetting the options.
		add_action( 'wp_ajax_mrshortcutsgb_reset_options', array( $this, 'ajax_reset_options' ) );

		// For initializing settings links on the plugins screen.
		add_action( 'admin_init', array( $this, 'init_settings_links' ) );

		// Load GenerateBlocks settings CSS / dashboard body class on the Shortcuts screen.
		add_filter( 'generateblocks_dashboard_screens', array( $this, 'add_dashboard_screen' ) );
	}

	/**
	 * Register the Extras admin screen as a GenerateBlocks dashboard page.
	 *
	 * This enqueues GenerateBlocks settings.css and adds the dashboard body class.
	 *
	 * @param array $screens Dashboard screen IDs.
	 * @return array
	 */
	public function add_dashboard_screen( $screens ) {
		$screens[] = 'generateblocks_page_mrshortcuts-gb';
		return $screens;
	}

	/**
	 * Initialize the setting links for the plugin page.
	 */
	public function init_settings_links() {
		$prefix = Functions::is_multisite() ? 'network_admin_' : '';
		add_action( $prefix . 'plugin_action_links_' . plugin_basename( MRSHORTCUTSGB_FILE ), array( $this, 'plugin_settings_link' ) );
	}

	/**
	 * Adds plugin settings page link to plugin links in WordPress Dashboard Plugins Page
	 *
	 * @since 1.0.0
	 *
	 * @param array $settings Uses $prefix . "plugin_action_links_$plugin_file" action.
	 * @return array Array of settings
	 */
	public function plugin_settings_link( $settings ) {
		$setting_links = array(
			'settings' => sprintf( '<a href="%s">%s</a>', esc_url( Functions::get_settings_url() ), esc_html__( 'Settings', 'mediaron-block-shortcuts-for-gb' ) ),
		);
		if ( ! is_array( $settings ) ) {
			return $setting_links;
		} else {
			return array_merge( $setting_links, $settings );
		}
	}

	/**
	 * Save the options via Ajax.
	 */
	public function ajax_save_options() {
		// Get form data.
		$form_data = Functions::sanitize_array_recursive( wp_unslash( filter_input( INPUT_POST, 'formData', FILTER_DEFAULT, FILTER_REQUIRE_ARRAY ) ) );

		$nonce = isset( $form_data['saveNonce'] ) ? sanitize_text_field( $form_data['saveNonce'] ) : false;
		if ( ! wp_verify_nonce( $nonce, 'mrshortcuts-gb-admin-save-options' ) || ! current_user_can( 'manage_options' ) ) {
			wp_send_json_error(
				array(
					'message'     => __( 'Nonce or permission verification failed.', 'mediaron-block-shortcuts-for-gb' ),
					'type'        => 'critical',
					'dismissable' => true,
					'title'       => __( 'Error', 'mediaron-block-shortcuts-for-gb' ),
				)
			);
		}

		// If no font data, assume empty array.
		if ( ! isset( $form_data['allowedGoogleFonts'] ) ) {
			$form_data['allowedGoogleFonts'] = array();
		}

		$form_enabled_post_types = $form_data['enabledPostTypes'] ?? array();
		$enabled_post_types      = array();

		// Loop through enabled post types to save them in the right format.
		foreach ( $form_enabled_post_types as $post_type => $enabled ) {
			$post_type = trim( sanitize_text_field( $post_type ) );
			if ( is_numeric( $post_type ) ) {
				continue;
			}
			$enabled_post_types[ $post_type ] = filter_var( $enabled, FILTER_VALIDATE_BOOLEAN );
		}

		// Assign back.
		$form_data['enabledPostTypes'] = $enabled_post_types;

		$form_auto_regen_post_types = $form_data['autoRegenerateStylesPostTypes'] ?? array();
		$auto_regen_post_types      = array();

		// Loop through auto-regenerate post types to save them in the right format.
		foreach ( $form_auto_regen_post_types as $post_type => $enabled ) {
			$post_type = trim( sanitize_text_field( $post_type ) );
			if ( is_numeric( $post_type ) ) {
				continue;
			}
			$auto_regen_post_types[ $post_type ] = filter_var( $enabled, FILTER_VALIDATE_BOOLEAN );
		}

		// Assign back.
		$form_data['autoRegenerateStylesPostTypes'] = $auto_regen_post_types;

		// Get array values.
		$form_data = Functions::sanitize_array_recursive( $form_data );

		// Update options.
		Options::update_options( $form_data );

		// Send success message.
		wp_send_json_success(
			array(
				'message'     => __( 'Options saved.', 'mediaron-block-shortcuts-for-gb' ),
				'type'        => 'success',
				'dismissable' => true,
			)
		);
	}

	/**
	 * Reset the options.
	 */
	public function ajax_reset_options() {
		// Get form data.
		$form_data = Functions::sanitize_array_recursive( wp_unslash( filter_input( INPUT_POST, 'formData', FILTER_DEFAULT, FILTER_REQUIRE_ARRAY ) ) );

		$nonce = isset( $form_data['resetNonce'] ) ? sanitize_text_field( $form_data['resetNonce'] ) : false;
		if ( ! wp_verify_nonce( $nonce, 'mrshortcuts-gb-admin-reset-options' ) || ! current_user_can( 'manage_options' ) ) {
			wp_send_json_error(
				array(
					'message'     => __( 'Nonce or permission verification failed.', 'mediaron-block-shortcuts-for-gb' ),
					'type'        => 'error',
					'dismissable' => true,
					'title'       => __( 'Error', 'mediaron-block-shortcuts-for-gb' ),
				)
			);
		}

		// Get existing options.
		$options = Options::get_options();

		// Get defaults and reset.
		$default_options = Options::get_defaults();

		Options::update_options( $default_options );

		// Pull in nonces to default options before returning.
		$default_options['saveNonce']  = $options['saveNonce'];
		$default_options['resetNonce'] = $options['resetNonce'];

		// Format empty arrays into false. This is so they can be reset at the form level.
		$default_options['membershipLevelsToExclude'] = false;
		$default_options['checkoutLevelsToExclude']   = false;

		// Send success message.
		wp_send_json_success(
			array(
				'message'     => __( 'Options reset.', 'mediaron-block-shortcuts-for-gb' ),
				'type'        => 'success',
				'dismissable' => true,
				'formData'    => $default_options,
			)
		);
	}

	/**
	 * Retrieve options via Ajax.
	 */
	public function ajax_get_options() {
		// Get nonce.
		$nonce = sanitize_text_field( wp_unslash( filter_input( INPUT_POST, 'nonce', FILTER_DEFAULT ) ) );

		// Verify nonce.
		$nonce_action = 'mrshortcuts-gb-admin-get-options';
		if ( ! wp_verify_nonce( $nonce, $nonce_action ) || ! current_user_can( 'manage_options' ) ) {
			wp_send_json_error(
				array(
					'message'     => __( 'Nonce or permission verification failed.', 'mediaron-block-shortcuts-for-gb' ),
					'type'        => 'error',
					'dismissable' => true,
					'title'       => __( 'Error', 'mediaron-block-shortcuts-for-gb' ),
				)
			);
		}
		$options = Options::get_options();
		wp_send_json_success( $options );
	}

	/**
	 * Add the admin menu.
	 */
	public function add_admin_menu() {
		add_submenu_page(
			'generateblocks',
			__( 'Shortcuts', 'mediaron-block-shortcuts-for-gb' ),
			__( 'Shortcuts', 'mediaron-block-shortcuts-for-gb' ),
			'manage_options',
			'mrshortcuts-gb',
			array( $this, 'admin_page' ),
			99
		);
	}

	/**
	 * Enqueue scripts for the admin page.
	 *
	 * @param string $hook The current admin page.
	 */
	public function enqueue_scripts( $hook ) {
		if ( 'generateblocks_page_mrshortcuts-gb' !== $hook ) {
			return;
		}

		// Enqueue main scripts.
		$deps = require Functions::get_plugin_dir( 'dist/mrshortcuts-gb-admin.asset.php' );
		wp_enqueue_script(
			'mrshortcuts-gb-admin',
			Functions::get_plugin_url( 'dist/mrshortcuts-gb-admin.js' ),
			$deps['dependencies'],
			$deps['version'],
			true
		);

		// Get all show in menu post types.
		$post_types = get_post_types(
			array(),
			'objects'
		);
		$excluded   = array( 'attachment', 'revision', 'nav_menu_item', 'gblocks_templates', 'gblocks_global_style' );
		$included   = array(
			'wp_template',
			'wp_template_part',
			'wp_block',
		);
		foreach ( $excluded as $exclude ) {
			if ( isset( $post_types[ $exclude ] ) ) {
				unset( $post_types[ $exclude ] );
			}
		}
		// Exclude those without show_ui as true and not in the included array.
		foreach ( $post_types as $post_type => $post_type_data ) {
			if ( ! $post_type_data->show_ui && ! in_array( $post_type, $included, true ) ) {
				unset( $post_types[ $post_type ] );
			}
		}

		$admin_script_data = array(
			'getNonce'     => wp_create_nonce( 'mrshortcuts-gb-admin-get-options' ),
			'saveNonce'    => wp_create_nonce( 'mrshortcuts-gb-admin-save-options' ),
			'resetNonce'   => wp_create_nonce( 'mrshortcuts-gb-admin-reset-options' ),
			'previewNonce' => wp_create_nonce( 'mrshortcuts-gb-admin-preview' ),
			'ajaxurl'      => admin_url( 'admin-ajax.php' ),
			'postTypes'    => $post_types,
			'isProActive'  => Functions::is_generateblocks_pro_active(),
		);

		// Omit the flag when GenerateBlocks is inactive so the settings notice stays hidden.
		if ( function_exists( 'generateblocks_use_v1_blocks' ) ) {
			$admin_script_data['gbUseV1Blocks'] = \generateblocks_use_v1_blocks() ? 'true' : 'false';
		}

		wp_localize_script(
			'mrshortcuts-gb-admin',
			'mrshortcutsgbAdmin',
			$admin_script_data
		);

		// Enqueue admin styles.
		wp_enqueue_style(
			'mrshortcuts-gb-admin-css',
			Functions::get_plugin_url( 'dist/mrshortcuts-gb-admin-css.css' ),
			array(),
			Functions::get_plugin_version(),
			'all'
		);
	}

	/**
	 * Render the admin page.
	 */
	public function admin_page() {
		?>
		<div class="wrap gblocks-dashboard-wrap mrshortcuts-gb-admin-wrap">
			<div class="generateblocks-settings-area">
				<div class="generateblocks-settings-main">
					<div id="mrshortcuts-gb"></div>
				</div>
			</div>
		</div>
		<?php
	}
}
