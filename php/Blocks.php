<?php
/**
 * Set up the blocks and their attributes.
 *
 * @package MRShortcutsGB
 */

namespace MRShortcutsGB;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Helper class for registering blocks.
 */
class Blocks {

	/**
	 * Main class runner.
	 *
	 * @return Blocks.
	 */
	public static function run() {
		$self = new self();
		add_action( 'init', array( $self, 'init' ) );
		add_action( 'rest_api_init', array( $self, 'init_rest_api' ) );
		add_filter( 'block_type_metadata', array( $self, 'add_block_metadata' ), 10, 1 );
		add_filter( 'generateblocks_typography_font_family_list', array( $self, 'add_adobe_fonts' ), 10, 1 );
		add_filter( 'generateblocks_typography_font_family_list', array( $self, 'add_blocksy_adobe_fonts' ), 10, 1 );
		add_filter( 'generateblocks_do_content', array( $self, 'add_post_type_content' ), 10, 2 );
		add_action( 'save_post', array( $self, 'maybe_regenerate_styles_on_save' ), 20, 2 );

		// Add any block categories needed.
		add_filter( 'block_categories_all', array( $self, 'add_block_categories' ), 500, 1 ); // High priority so others can add their categories first.
		return $self;
	}

	/**
	 * Add any block categories needed.
	 *
	 * @param array $categories List of categories.
	 */
	public function add_block_categories( $categories ) {
		$block_labels_enabled = true; // @TODO: Make this dynamic.
		if ( ! $block_labels_enabled ) {
			return $categories;
		}

		$options  = Options::get_options();
		$v1_label = $options['v1CategoryLabel'] ?? __( 'GenerateBlocks v1 (Legacy Blocks)', 'mediaron-block-shortcuts-for-gb' );
		$v2_label = $options['v2CategoryLabel'] ?? __( 'GenerateBlocks v2 (New Blocks)', 'mediaron-block-shortcuts-for-gb' );

		// Now add the GenerateBlocks category.
		$generateblocks_category = array(
			'slug'  => 'generateblocks-v1',
			'title' => esc_html( $v1_label ),
		);
		// Find the index of the `generateblocks` category.
		$generateblocks_index = array_search( 'generateblocks', array_column( $categories, 'slug' ), true );
		if ( false !== $generateblocks_index ) {
			// Rename category to `GenerateBlocks v2 (New Blocks)` and remove from array.
			$gb_v2_category = $categories[ $generateblocks_index ];
			unset( $categories[ $generateblocks_index ] );
			$gb_v2_category['title'] = esc_html( $v2_label );

			// Add V2 blocks to the beginning.
			array_unshift( $categories, $gb_v2_category );

			// Add V1 blocks to the end.
			$categories[] = $generateblocks_category;
		}
		return $categories;
	}

	/**
	 * Add post type content.
	 *
	 * @param string $content Post content.
	 */
	public function add_post_type_content( $content ) {
		global $post;
		// Get the ID.
		$post_id = $post->ID ?? 0;
		// Bail if no ID.
		if ( ! $post_id ) {
			return $content;
		}
		$options            = Options::get_options();
		$enabled_post_types = $options['enabledPostTypes'] ?? array();
		$current_post_type  = get_post_type( $post_id );

		// If post or page, bail.
		if ( in_array( $current_post_type, array( 'post', 'page' ), true ) ) {
			return $content;
		}

		if ( in_array( $current_post_type, $enabled_post_types, true ) ) {
			$block_element = get_post( $post_id );
			if ( $block_element ) {
				if ( 'publish' === $block_element->post_status && empty( $block_element->post_password ) ) {
					$content .= $block_element->post_content;
				}
			}
		}
		return $content;
	}

	/**
	 * Clear GenerateBlocks dynamic CSS tracking when a selected post type is saved.
	 *
	 * @param int      $post_id Post ID.
	 * @param \WP_Post $post    Post object.
	 */
	public function maybe_regenerate_styles_on_save( $post_id, $post ) {
		if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) {
			return;
		}

		if ( wp_is_post_autosave( $post_id ) || wp_is_post_revision( $post_id ) ) {
			return;
		}

		if ( empty( $post->post_type ) ) {
			return;
		}

		$options               = Options::get_options();
		$auto_regen_post_types = $options['autoRegenerateStylesPostTypes'] ?? array();

		if ( empty( $auto_regen_post_types[ $post->post_type ] ) ) {
			return;
		}

		update_option( 'generateblocks_dynamic_css_posts', array() );
	}

	/**
	 * Add Adobe Fonts to the list of fonts.
	 *
	 * @param array $fonts List of fonts.
	 */
	public function add_adobe_fonts( $fonts ) {
		$options = Options::get_options();
		if ( ! (bool) $options['enableAdobeFonts'] ) {
			return $fonts;
		}

		// Get the adobe fonts.
		$fonts_group = array();
		if ( defined( 'CUSTOM_TYPEKIT_FONTS_FILE' ) ) {
			$adobe_fonts = get_option( 'custom-typekit-fonts', array() );
			if ( isset( $adobe_fonts['custom-typekit-font-details'] ) ) {
				foreach ( $adobe_fonts['custom-typekit-font-details'] as $font_name => $font_details ) {
					$fonts_group[] = array(
						'value' => $font_name,
						'label' => $font_name,
					);
				}
			}
		}
		if ( ! empty( $fonts_group ) ) {
			$fonts[] = array(
				'label'   => __( 'Adobe Fonts', 'mediaron-block-shortcuts-for-gb' ),
				'options' => $fonts_group,
			);
		}
		return $fonts;
	}

	/**
	 * Add Adobe Fonts to the list of fonts.
	 *
	 * @param array $fonts List of fonts.
	 */
	public function add_blocksy_adobe_fonts( $fonts ) {
		$options = Options::get_options();
		if ( ! (bool) $options['enableAdobeFonts'] ) {
			return $fonts;
		}

		// Get blocksy adobe fonts.
		$options       = get_option( 'blocksy_ext_adobe_typekit_settings', array() );
		$font_families = $options['fonts'] ?? array();
		$project_id    = $options['project_id'] ?? '';
		if ( ! empty( $project_id ) ) {
			// Add fonts to list.
			if ( ! empty( $font_families ) ) {
				$fonts_group = array();
				foreach ( $font_families as $font_family ) {
					$fonts_group[] = array(
						'value' => $font_family['slug'],
						'label' => $font_family['name'] . 'asdflkj',
					);
				}
				$fonts[] = array(
					'label'   => __( 'Adobe Fonts', 'mediaron-block-shortcuts-for-gb' ),
					'options' => $fonts_group,
				);
			}
		}

		// Get blocksy google fonts.
		$google_fonts = get_option( 'blocksy_ext_local_google_fonts_settings', array() );
		if ( $google_fonts && isset( $google_fonts['fonts'] ) ) {
			$fonts_group = array();
			foreach ( $google_fonts['fonts'] as $font_family ) {
				$fonts_group[] = array(
					'value' => $font_family['name'],
					'label' => $font_family['name'],
				);
			}
			$fonts[] = array(
				'label'   => __( 'Google Fonts', 'mediaron-block-shortcuts-for-gb' ),
				'options' => $fonts_group,
			);
		}
		return $fonts;
	}

	/**
	 * Set Paragraph defaults.
	 *
	 * @param array $metadata {
	 *    An array of arguments.
	 *
	 *    @type string $name       Block name.
	 *    @type array  $attributes Block attributes.
	 * }
	 */
	public function add_block_metadata( $metadata ) {
		// Check the block type.
		if ( 'generateblocks/headline' !== $metadata['name'] ) {
			return $metadata;
		}

		// Add accordion view (collapsed view).
		$metadata['attributes']['element']['default'] = 'p';

		// Return the metadata.
		return $metadata;
	}

	/**
	 * Register the rest routes needed.
	 */
	public function init_rest_api() {
		register_rest_route(
			'mediaron/block-shortcuts-for-gb/v1',
			'/process_image',
			array(
				'methods'             => 'POST',
				'callback'            => array( $this, 'rest_add_remote_image' ),
				'permission_callback' => array( $this, 'rest_image_sideload_permissions' ),
			)
		);
		register_rest_route(
			'mediaron/block-shortcuts-for-gb/v1',
			'/regenerate_css_files',
			array(
				'methods'             => 'POST',
				'callback'            => array( $this, 'rest_regenerate_css_files' ),
				'permission_callback' => array( $this, 'rest_can_regenerate_css_files' ),
			)
		);
		register_rest_route(
			'mediaron/block-shortcuts-for-gb/v1',
			'/asset_icon_groups',
			array(
				'methods'             => 'GET',
				'callback'            => array( $this, 'rest_get_asset_icon_groups' ),
				'permission_callback' => array( $this, 'rest_can_manage_asset_library' ),
			)
		);
		register_rest_route(
			'mediaron/block-shortcuts-for-gb/v1',
			'/save_asset_icon',
			array(
				'methods'             => 'POST',
				'callback'            => array( $this, 'rest_save_asset_icon' ),
				'permission_callback' => array( $this, 'rest_can_manage_asset_library' ),
				'args'                => array(
					'name'  => array(
						'required'          => true,
						'type'              => 'string',
						'sanitize_callback' => 'sanitize_text_field',
					),
					'group' => array(
						'required'          => true,
						'type'              => 'string',
						'sanitize_callback' => 'sanitize_text_field',
					),
					'svg'   => array(
						'required' => true,
						'type'     => 'string',
					),
				),
			)
		);
	}

	/**
	 * Process a list of images for a plugin.
	 *
	 * @param \WP_REST_Request $request REST request.
	 */
	public function rest_add_remote_image( $request ) {
		$image_url = filter_var( $request->get_param( 'imgUrl' ), FILTER_VALIDATE_URL );
		$image_alt = sanitize_text_field( $request->get_param( 'imgAlt' ) );

		if ( $image_url ) {
			// Check file extension.
			$extension = pathinfo( $image_url, PATHINFO_EXTENSION );

			// Strip query vars from extension.
			$extension = preg_replace( '/\?.*/', '', $extension );

			// Get current domain.
			$domain = wp_parse_url( $image_url, PHP_URL_HOST );

			// If we're on same domain, bail successfully.
			if ( isset( $_SERVER['HTTP_HOST'] ) && sanitize_text_field( wp_unslash( $_SERVER['HTTP_HOST'] ) ) === $domain ) {
				\wp_send_json_success(
					array(
						'attachmentId'  => 0,
						'attachmentUrl' => esc_url( $image_url ),
					)
				);
			}

			if ( ! $extension ) {
				\wp_send_json_error(
					array(
						'message' => __( 'File extension not found.', 'mediaron-block-shortcuts-for-gb' ),
					),
					400
				);
			}
			$valid_extensions = Functions::get_supported_file_extensions();
			if ( ! in_array( $extension, $valid_extensions, true ) ) {
				\wp_send_json_error(
					array(
						'message' => __( 'Invalid file extension.', 'mediaron-block-shortcuts-for-gb' ),
					),
					400
				);
			}

			// Save the image to the media library.
			if ( ! function_exists( 'media_sideload_image' ) ) {
				require_once ABSPATH . 'wp-admin/includes/image.php';
				require_once ABSPATH . 'wp-admin/includes/file.php';
				require_once ABSPATH . 'wp-admin/includes/media.php';
			}
			$attachment_id = media_sideload_image( $image_url, 0, '', 'id' );

			// Add order to attachment.
			if ( ! is_wp_error( $attachment_id ) ) {

				// Get attachment URL.
				$attachment_url_src = wp_get_attachment_image_src( $attachment_id, 'full' );
				$attachment_url     = $attachment_url_src[0];

				// Update alt attribute.
				update_post_meta( $attachment_id, '_wp_attachment_image_alt', $image_alt );

				// Send success.
				\wp_send_json_success(
					array(
						'attachmentId'  => absint( $attachment_id ),
						'attachmentUrl' => esc_url( $attachment_url ),
					)
				);
			} else {
				\wp_send_json_error(
					array(
						'message' => $attachment_id->get_error_message(),
					),
					400
				);
			}
		}
		\wp_send_json_error(
			array(
				'message' => __( 'Invalid image URL.', 'mediaron-block-shortcuts-for-gb' ),
			),
			400
		);
	}

	/**
	 * Regenerate GenerateBlocks CSS caches and global stylesheet files.
	 *
	 * @param \WP_REST_Request $request REST request.
	 * @return \WP_REST_Response
	 */
	public function rest_regenerate_css_files( $request ) {
		unset( $request );

		update_option( 'generateblocks_dynamic_css_posts', array() );

		if ( class_exists( 'GenerateBlocks_Pro_Enqueue_Styles' ) ) {
			$styles_enqueue = \GenerateBlocks_Pro_Enqueue_Styles::get_instance();
			$styles_enqueue->build_css();

			return new \WP_REST_Response(
				array(
					'success'  => true,
					'response' => __( 'Global styles CSS regenerated successfully.', 'mediaron-block-shortcuts-for-gb' ),
				),
				200
			);
		}

		if ( class_exists( 'GenerateBlocks_Enqueue_CSS' ) ) {
			$legacy_enqueue = \GenerateBlocks_Enqueue_CSS::get_instance();

			if ( is_callable( array( $legacy_enqueue, 'make_css' ) ) ) {
				$legacy_enqueue->make_css();
			}
		}

		return new \WP_REST_Response(
			array(
				'success'  => true,
				'response' => __( 'CSS caches cleared. Block styles will regenerate on the next page load.', 'mediaron-block-shortcuts-for-gb' ),
			),
			200
		);
	}

	/**
	 * Check if user has access to REST API for retrieving and sideloading images.
	 */
	public function rest_image_sideload_permissions() {
		// Only allow authors and up the ability to import remote images.
		return current_user_can( 'upload_files' ) && current_user_can( 'publish_posts' );
	}

	/**
	 * Check if user has access to REST API for regenerating CSS files.
	 */
	public function rest_can_regenerate_css_files() {
		return current_user_can( 'manage_options' );
	}

	/**
	 * Check if user can manage the GenerateBlocks Pro asset library.
	 *
	 * @return bool
	 */
	public function rest_can_manage_asset_library() {
		return current_user_can( 'manage_options' );
	}

	/**
	 * Allowed HTML for Asset Library SVG markup.
	 *
	 * Starts from GenerateBlocks Pro's kses map, then adds presentation tags
	 * Pro's list omits (gradients, defs, basic shapes) so filtered users can
	 * still save typical icon SVGs.
	 *
	 * @return array
	 */
	private function get_asset_svg_allowed_html() {
		if ( function_exists( 'generateblocks_pro_kses_svg' ) ) {
			$allowed = \generateblocks_pro_kses_svg();
		} else {
			$allowed = wp_kses_allowed_html( 'post' );
		}

		if ( ! is_array( $allowed ) ) {
			$allowed = array();
		}

		$common = array(
			'id'                => true,
			'class'             => true,
			'fill'              => true,
			'stroke'            => true,
			'stroke-width'      => true,
			'stroke-linecap'    => true,
			'stroke-linejoin'   => true,
			'stroke-miterlimit' => true,
			'stroke-dasharray'  => true,
			'stroke-opacity'    => true,
			'fill-opacity'      => true,
			'fill-rule'         => true,
			'clip-rule'         => true,
			'clip-path'         => true,
			'opacity'           => true,
			'transform'         => true,
			'display'           => true,
		);

		$svg_args = array(
			'svg'            => array_merge(
				$common,
				array(
					'aria-hidden'         => true,
					'aria-labelledby'     => true,
					'role'                => true,
					'xmlns'               => true,
					'width'               => true,
					'height'              => true,
					'viewbox'             => true,
					'x'                   => true,
					'y'                   => true,
					'preserveaspectratio' => true,
					'version'             => true,
					'focusable'           => true,
				)
			),
			'g'              => $common,
			'title'          => array(
				'title' => true,
				'id'    => true,
			),
			'desc'           => array(
				'id' => true,
			),
			'defs'           => array(
				'id' => true,
			),
			'path'           => array_merge(
				$common,
				array(
					'd' => true,
				)
			),
			'circle'         => array_merge(
				$common,
				array(
					'cx' => true,
					'cy' => true,
					'r'  => true,
				)
			),
			'ellipse'        => array_merge(
				$common,
				array(
					'cx' => true,
					'cy' => true,
					'rx' => true,
					'ry' => true,
				)
			),
			'rect'           => array_merge(
				$common,
				array(
					'x'      => true,
					'y'      => true,
					'width'  => true,
					'height' => true,
					'rx'     => true,
					'ry'     => true,
				)
			),
			'line'           => array_merge(
				$common,
				array(
					'x1' => true,
					'y1' => true,
					'x2' => true,
					'y2' => true,
				)
			),
			'polyline'       => array_merge(
				$common,
				array(
					'points' => true,
				)
			),
			'polygon'        => array_merge(
				$common,
				array(
					'points' => true,
				)
			),
			'lineargradient' => array(
				'id'                => true,
				'x1'                => true,
				'x2'                => true,
				'y1'                => true,
				'y2'                => true,
				'gradientunits'     => true,
				'gradienttransform' => true,
				'spreadmethod'      => true,
				'href'              => true,
			),
			'radialgradient' => array(
				'id'                => true,
				'cx'                => true,
				'cy'                => true,
				'r'                 => true,
				'fx'                => true,
				'fy'                => true,
				'fr'                => true,
				'gradientunits'     => true,
				'gradienttransform' => true,
				'spreadmethod'      => true,
				'href'              => true,
			),
			'stop'           => array(
				'offset'       => true,
				'stop-color'   => true,
				'stop-opacity' => true,
			),
			'clippath'       => array(
				'id'            => true,
				'clippathunits' => true,
			),
			'mask'           => array(
				'id'               => true,
				'x'                => true,
				'y'                => true,
				'width'            => true,
				'height'           => true,
				'maskunits'        => true,
				'maskcontentunits' => true,
			),
			'symbol'         => array(
				'id'                  => true,
				'viewbox'             => true,
				'preserveaspectratio' => true,
			),
		);

		foreach ( $svg_args as $tag => $attrs ) {
			$allowed[ $tag ] = isset( $allowed[ $tag ] ) && is_array( $allowed[ $tag ] )
				? array_merge( $allowed[ $tag ], $attrs )
				: $attrs;
		}

		return $allowed;
	}

	/**
	 * Strip XML prolog so the markup can be inlined in the icon picker.
	 *
	 * @param string $svg SVG markup.
	 * @return string
	 */
	private function prepare_inline_svg( $svg ) {
		$svg = preg_replace( '/^\xEF\xBB\xBF/', '', $svg );
		$svg = preg_replace( '/<\?xml[^>]*\?>/i', '', $svg );
		$svg = preg_replace( '/<!DOCTYPE[^>]*>/i', '', $svg );

		return is_string( $svg ) ? trim( $svg ) : '';
	}

	/**
	 * Sanitize SVG with Safe SVG / enshrined when that plugin is available.
	 *
	 * @param string $svg Raw SVG markup.
	 * @return string Clean markup, or empty when the sanitizer is unavailable.
	 */
	private function sanitize_asset_svg_with_safe_svg( $svg ) {
		if ( class_exists( '\SafeSvg\Svg_Sanitizer' ) && method_exists( '\SafeSvg\Svg_Sanitizer', 'sanitize_markup' ) ) {
			$clean = \SafeSvg\Svg_Sanitizer::sanitize_markup( $svg );
			return is_string( $clean ) ? $this->prepare_inline_svg( $clean ) : '';
		}

		if ( class_exists( '\enshrined\svgSanitize\Sanitizer' ) ) {
			$sanitizer = new \enshrined\svgSanitize\Sanitizer();
			$sanitizer->minify( true );
			$clean = $sanitizer->sanitize( $svg );
			return is_string( $clean ) ? $this->prepare_inline_svg( $clean ) : '';
		}

		return '';
	}

	/**
	 * Sanitize SVG markup for the Asset Library.
	 *
	 * Matches GenerateBlocks Pro's icon REST save: Safe SVG when present,
	 * otherwise skip kses for unfiltered_html, otherwise wp_kses.
	 *
	 * @param mixed $svg Raw SVG markup.
	 * @return string
	 */
	private function sanitize_asset_svg( $svg ) {
		if ( ! is_string( $svg ) ) {
			return '';
		}

		$svg = trim( $svg );
		if ( '' === $svg ) {
			return '';
		}

		$safe_svg = $this->sanitize_asset_svg_with_safe_svg( $svg );
		if ( '' !== $safe_svg ) {
			return $safe_svg;
		}

		if ( current_user_can( 'unfiltered_html' ) ) {
			return $svg;
		}

		return wp_kses( $svg, $this->get_asset_svg_allowed_html() );
	}

	/**
	 * Normalize SVG markup for duplicate comparison.
	 *
	 * GenerateBlocks' icon picker highlights every library item whose SVG
	 * string matches the block, so whitespace-only differences still collide.
	 *
	 * @param string $svg SVG markup.
	 * @return string
	 */
	private function normalize_asset_svg_for_compare( $svg ) {
		$normalized = preg_replace( '/\s+/', ' ', trim( (string) $svg ) );

		return is_string( $normalized ) ? $normalized : '';
	}

	/**
	 * Find an existing icon in a group with equivalent SVG markup.
	 *
	 * @param array  $icons Group icons.
	 * @param string $svg   Sanitized SVG markup.
	 * @return array|null
	 */
	private function find_existing_asset_icon( $icons, $svg ) {
		if ( ! is_array( $icons ) ) {
			return null;
		}

		$normalized = $this->normalize_asset_svg_for_compare( $svg );
		if ( '' === $normalized ) {
			return null;
		}

		foreach ( $icons as $maybe_icon ) {
			if ( ! is_array( $maybe_icon ) || empty( $maybe_icon['icon'] ) || ! is_string( $maybe_icon['icon'] ) ) {
				continue;
			}

			if ( $this->normalize_asset_svg_for_compare( $maybe_icon['icon'] ) === $normalized ) {
				return $maybe_icon;
			}
		}

		return null;
	}

	/**
	 * Keep one icon per unique SVG string in each Asset Library group.
	 *
	 * @param array $icons generateblocks_svg_icons option value.
	 * @return array
	 */
	private function dedupe_asset_library_icons( $icons ) {
		if ( ! is_array( $icons ) ) {
			return array();
		}

		foreach ( $icons as $index => $data ) {
			if ( empty( $data['icons'] ) || ! is_array( $data['icons'] ) ) {
				continue;
			}

			$seen   = array();
			$unique = array();

			foreach ( $data['icons'] as $icon ) {
				if ( ! is_array( $icon ) || empty( $icon['icon'] ) || ! is_string( $icon['icon'] ) ) {
					continue;
				}

				$normalized = $this->normalize_asset_svg_for_compare( $icon['icon'] );
				if ( '' === $normalized || isset( $seen[ $normalized ] ) ) {
					continue;
				}

				$seen[ $normalized ] = true;
				$unique[]            = $icon;
			}

			$icons[ $index ]['icons'] = $unique;
		}

		return $icons;
	}

	/**
	 * Return unique Asset Library icon group names.
	 *
	 * @param \WP_REST_Request $request REST request.
	 * @return \WP_REST_Response|\WP_Error
	 */
	public function rest_get_asset_icon_groups( $request ) {
		unset( $request );

		if ( ! Functions::is_generateblocks_pro_active() ) {
			return new \WP_Error(
				'gb_pro_required',
				__( 'GenerateBlocks Pro is required to use the Asset Library.', 'mediaron-block-shortcuts-for-gb' ),
				array( 'status' => 400 )
			);
		}

		$icons  = get_option( 'generateblocks_svg_icons', array() );
		$groups = array();

		if ( is_array( $icons ) ) {
			foreach ( $icons as $data ) {
				if ( ! empty( $data['group'] ) && is_string( $data['group'] ) ) {
					$groups[] = $data['group'];
				}
			}
		}

		$groups = array_values( array_unique( $groups ) );

		return new \WP_REST_Response(
			array(
				'success' => true,
				'groups'  => $groups,
			),
			200
		);
	}

	/**
	 * Append an icon to the GenerateBlocks Pro Asset Library.
	 *
	 * @param \WP_REST_Request $request REST request.
	 * @return \WP_REST_Response|\WP_Error
	 */
	public function rest_save_asset_icon( $request ) {
		if ( ! Functions::is_generateblocks_pro_active() ) {
			return new \WP_Error(
				'gb_pro_required',
				__( 'GenerateBlocks Pro is required to use the Asset Library.', 'mediaron-block-shortcuts-for-gb' ),
				array( 'status' => 400 )
			);
		}

		$name  = sanitize_text_field( $request->get_param( 'name' ) );
		$group = sanitize_text_field( $request->get_param( 'group' ) );
		$svg   = $this->sanitize_asset_svg( $request->get_param( 'svg' ) );

		if ( '' === $name || '' === $group ) {
			return new \WP_Error(
				'invalid_asset_icon',
				__( 'Icon name and group are required.', 'mediaron-block-shortcuts-for-gb' ),
				array( 'status' => 400 )
			);
		}

		if ( '' === $svg || false === stripos( $svg, '<svg' ) ) {
			return new \WP_Error(
				'invalid_asset_svg',
				__( 'A valid SVG is required.', 'mediaron-block-shortcuts-for-gb' ),
				array( 'status' => 400 )
			);
		}

		$icons = get_option( 'generateblocks_svg_icons', array() );
		if ( ! is_array( $icons ) ) {
			$icons = array();
		}
		$icons = $this->dedupe_asset_library_icons( $icons );

		$group_index = null;
		foreach ( $icons as $index => $data ) {
			if ( isset( $data['group'] ) && is_string( $data['group'] ) && 0 === strcasecmp( $data['group'], $group ) ) {
				$group_index = $index;
				$group       = $data['group'];
				break;
			}
		}

		$existing_icon = null;
		if ( null !== $group_index && ! empty( $icons[ $group_index ]['icons'] ) ) {
			$existing_icon = $this->find_existing_asset_icon( $icons[ $group_index ]['icons'], $svg );
		}

		if ( is_array( $existing_icon ) ) {
			$existing_id   = ! empty( $existing_icon['id'] ) ? sanitize_key( $existing_icon['id'] ) : '';
			$existing_name = ! empty( $existing_icon['name'] ) ? $existing_icon['name'] : $name;
			$existing_svg  = ! empty( $existing_icon['icon'] ) ? $existing_icon['icon'] : $svg;

			update_option( 'generateblocks_svg_icons', $icons, false );

			return new \WP_REST_Response(
				array(
					'success'       => true,
					'id'            => $existing_id,
					'name'          => $existing_name,
					'group'         => $group,
					'groupKey'      => sanitize_key( $group ),
					'icon'          => $existing_svg,
					'alreadyExists' => true,
				),
				200
			);
		}

		$icon_id = sanitize_key( $name . '-' . uniqid() );
		$icon    = array(
			'id'   => $icon_id,
			'name' => $name,
			'icon' => $svg,
		);

		if ( null === $group_index ) {
			$icons[] = array(
				'group'    => $group,
				'group_id' => str_replace( ' ', '-', strtolower( $group ) ),
				'icons'    => array( $icon ),
			);
		} else {
			if ( empty( $icons[ $group_index ]['icons'] ) || ! is_array( $icons[ $group_index ]['icons'] ) ) {
				$icons[ $group_index ]['icons'] = array();
			}
			$icons[ $group_index ]['icons'][] = $icon;
		}

		update_option( 'generateblocks_svg_icons', $icons, false );

		return new \WP_REST_Response(
			array(
				'success'       => true,
				'id'            => $icon_id,
				'name'          => $name,
				'group'         => $group,
				'groupKey'      => sanitize_key( $group ),
				'icon'          => $svg,
				'alreadyExists' => false,
			),
			200
		);
	}

	/**
	 * Init action callback.
	 */
	public function init() {
		if ( function_exists( 'wp_register_block_types_from_metadata_collection' ) ) {
			wp_register_block_types_from_metadata_collection( Functions::get_plugin_dir( 'build' ), Functions::get_plugin_dir( 'build/blocks-manifest.php' ) );
		} else {
			if ( function_exists( 'wp_register_block_metadata_collection' ) ) {
				wp_register_block_metadata_collection( Functions::get_plugin_dir( 'build' ), Functions::get_plugin_dir( 'build/blocks-manifest.php' ) );
			}
			$manifest_data = require Functions::get_plugin_dir( 'build/blocks-manifest.php' );
			foreach ( array_keys( $manifest_data ) as $block_type ) {
				register_block_type( __DIR__ . "/build/js/blocks/{$block_type}" );
			}
		}

		// Enqueue block assets.
		add_action( 'enqueue_block_assets', array( $this, 'register_block_styles' ) );
		add_action( 'enqueue_block_assets', array( $this, 'register_block_editor_scripts' ) );

		// Enqueue command scripts.
		add_action( 'enqueue_block_editor_assets', array( $this, 'enqueue_block_editor_commands' ) );
		add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_admin_commands' ) );
		add_action( 'admin_footer', array( $this, 'admin_commands_footer' ) );
		add_action( 'wp_enqueue_scripts', array( $this, 'enqueue_frontend_commands' ) );
		add_action( 'wp_footer', array( $this, 'frontend_commands_footer' ) );
	}

	/**
	 * Register the block editor styles.
	 */
	public function register_block_styles() {
		if ( ! is_admin() ) {
			return;
		}
		wp_register_style(
			'mrshortcuts-gb-block-editor-styles',
			false,
			array(),
			Functions::get_plugin_version(),
			'all'
		);
		wp_enqueue_style( 'mrshortcuts-gb-block-editor-styles' );
		wp_add_inline_style(
			'mrshortcuts-gb-block-editor-styles',
			'[data-container-type] {
				position: relative;
			}
			[data-container-type]::after {
				content: "";
				position: absolute;
				top: 0;
				left: 0;
				right: 0;
				bottom: 0;
				pointer-events: none;
				z-index: 9999;
				border: 3px solid #949494;
			}
			[data-container-type="container"]::after {
				border-color: #00a32a;
				z-index: 20;
			}
			[data-container-type="element"]::after {
				border-color: #007cba;
				z-index: 20;
			}
			[data-container-type="grid"]::after {
				border-color: #333333;
				z-index: 30;
			}'
		);
	}

	/**
	 * Register the block editor script with localized vars.
	 */
	public function register_block_editor_scripts() {
		if ( ! is_admin() ) {
			return;
		}
		$options = Options::get_options();

		wp_register_style(
			'mrshortcuts-gb-pattern-inserter-block-css',
			Functions::get_plugin_url( 'build/index.css' ),
			array(),
			Functions::get_plugin_version(),
			'all'
		);

		$deps = require Functions::get_plugin_dir( 'build/index.asset.php' );

		wp_enqueue_script(
			'mrshortcuts-gb-pattern-inserter-block',
			Functions::get_plugin_url( 'build/index.js' ),
			$deps['dependencies'],
			$deps['version'],
			true
		);

		wp_localize_script(
			'mrshortcuts-gb-pattern-inserter-block',
			'mrshortcutsgbPatternInserter',
			array(
				'restUrl'                       => rest_url( 'mediaron/block-shortcuts-for-gb/v1' ),
				'restNonce'                     => wp_create_nonce( 'wp_rest' ),
				'allowedGoogleFonts'            => $options['allowedGoogleFonts'] ?? array(),
				'enableMarkdownToHeadlineBlock' => ( ( $options['enableMarkdownToHeadlineBlock'] ?? false ) ? 'true' : 'false' ),
				'enableV1Transformations'       => ( ( $options['enableV1Transformations'] ?? false ) ? 'true' : 'false' ),
				'enableV1Blocks'                => ( ( $options['enableV1Blocks'] ?? false ) ? 'true' : 'false' ),
				'v1CategoryLabel'               => esc_html( $options['v1CategoryLabel'] ?? esc_html__( 'GenerateBlocks v1', 'mediaron-block-shortcuts-for-gb' ) ),
				'v2CategoryLabel'               => esc_html( $options['v2CategoryLabel'] ?? esc_html__( 'GenerateBlocks v2', 'mediaron-block-shortcuts-for-gb' ) ),
				'v1BlockSuffix'                 => esc_html( $options['v1BlockSuffix'] ?? esc_html__( '(v1)', 'mediaron-block-shortcuts-for-gb' ) ),
				'v2BlockSuffix'                 => esc_html( $options['v2BlockSuffix'] ?? esc_html__( '(v2)', 'mediaron-block-shortcuts-for-gb' ) ),
				'isProActive'                   => Functions::is_generateblocks_pro_active() ? 'true' : 'false',
				'canManageAssetLibrary'         => current_user_can( 'manage_options' ) ? 'true' : 'false',
			)
		);

		// Enqueue the block labels script.
		$block_labels_enabled = true; // @TODO: Make this dynamic.
		if ( $block_labels_enabled ) {
			$deps = require Functions::get_plugin_dir( 'build/mrshortcuts-gb-block-labels.asset.php' );
			wp_enqueue_script(
				'mrshortcuts-gb-block-labels',
				Functions::get_plugin_url( 'build/mrshortcuts-gb-block-labels.js' ),
				$deps['dependencies'],
				$deps['version'],
				true
			);
		}
	}

	/**
	 * Enqueue block editor commands.
	 */
	public function enqueue_block_editor_commands() {
		if ( ! current_user_can( 'manage_options' ) ) {
			return;
		}

		$deps = require Functions::get_plugin_dir( 'build/mrshortcuts-gb-commands-block-editor.asset.php' );
		wp_enqueue_script(
			'mrshortcuts-gb-commands-block-editor',
			Functions::get_plugin_url( 'build/mrshortcuts-gb-commands-block-editor.js' ),
			$deps['dependencies'],
			$deps['version'],
			true
		);

		wp_localize_script(
			'mrshortcuts-gb-commands-block-editor',
			'mrshortcutsgbCommands',
			array(
				'isProActive' => Functions::is_generateblocks_pro_active() ? 'true' : 'false',
			)
		);
	}

	/**
	 * Enqueue admin-wide commands.
	 */
	public function enqueue_admin_commands() {
		if ( ! current_user_can( 'manage_options' ) ) {
			return;
		}

		if ( get_current_screen()->is_block_editor() ) {
			return;
		}

		$deps = require Functions::get_plugin_dir( 'build/mrshortcuts-gb-commands-admin.asset.php' );
		wp_enqueue_script(
			'mrshortcuts-gb-commands-admin',
			Functions::get_plugin_url( 'build/mrshortcuts-gb-commands-admin.js' ),
			$deps['dependencies'],
			$deps['version'],
			true
		);
	}

	/**
	 * Add hidden div for admin-wide command palette.
	 */
	public function admin_commands_footer() {
		if ( ! current_user_can( 'manage_options' ) ) {
			return;
		}
		echo '<div id="mrshortcuts-gb-commands-admin" style="display: none; visibility: hidden; position: absolute; top: 0; left: 0; width: 0; height: 0; overflow: hidden;"></div>';
	}

	/**
	 * Add hidden div for frontend command palette.
	 */
	public function frontend_commands_footer() {
		if ( ! is_user_logged_in() || ! current_user_can( 'manage_options' ) ) {
			return;
		}
		echo '<div id="mrshortcuts-gb-commands-frontend" style="display: none; visibility: hidden; position: absolute; top: 0; left: 0; width: 0; height: 0; overflow: hidden;"></div>';
	}

	/**
	 * Enqueue frontend commands (optional).
	 *
	 * Note: WordPress doesn't officially support command palette on frontend,
	 * but we can manually enqueue assets and initialize it.
	 */
	public function enqueue_frontend_commands() {
		if ( ! is_user_logged_in() ) {
			return;
		}

		if ( ! current_user_can( 'manage_options' ) ) {
			return;
		}

		// Check if frontend command palette is enabled.
		$options                         = Options::get_options();
		$enable_frontend_command_palette = (bool) $options['enableFrontendCommandPalette'];
		if ( ! $enable_frontend_command_palette ) {
			return;
		}

		// Enqueue WordPress command palette assets (WordPress 6.9+).
		// Only call if not already enqueued (check if wp-commands script is already queued).
		if ( function_exists( 'wp_enqueue_command_palette_assets' ) && ! wp_script_is( 'wp-commands', 'enqueued' ) ) {
			wp_enqueue_command_palette_assets();
		}

		// Enqueue our frontend commands script.
		$deps = require Functions::get_plugin_dir( 'build/mrshortcuts-gb-commands-frontend.asset.php' );
		wp_enqueue_script(
			'mrshortcuts-gb-commands-frontend',
			Functions::get_plugin_url( 'build/mrshortcuts-gb-commands-frontend.js' ),
			$deps['dependencies'],
			$deps['version'],
			true
		);

		// Needed to clear up some potential conflicts with other plugins.
		wp_add_inline_style(
			'wp-commands',
			'.commands-command-menu__container .has-icon:not(.components-button) {
				width: inherit;
				height: inherit;
			}'
		);
	}
}
