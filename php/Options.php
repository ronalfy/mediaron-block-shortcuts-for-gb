<?php

/**
 * Admin class.
 *
 * @package MRShortcutsGB
 */

namespace MRShortcutsGB;

if ( ! defined( 'ABSPATH' ) ) {
	die( 'No direct access.' );
}

/**
 * Class that updates and stores the options.
 */
class Options {


	/**
	 * Array holding the options.
	 *
	 * @var array
	 */
	protected static $options = false;

	/**
	 * The key used to store the options.
	 *
	 * @var string
	 */
	protected static $options_key = 'mrshortcutsgb_options';

	/**
	 * Update options via sanitization
	 *
	 * @since 1.0.0
	 * @access public
	 * @param array $options array of options to save.
	 * @return array $options.
	 */
	public static function update_options( $options ) {
		$force           = true;
		$current_options = self::get_options( $force );
		foreach ( $options as $key => &$option ) {
			switch ( $key ) {
				case 'enabled':
				case 'enableFrontendCommandPalette':
					$option = filter_var( $options[ $key ], FILTER_VALIDATE_BOOLEAN );
					break;
				case 'adminMenuBar':
					if ( is_array( $option ) ) {
						// Sanitize enabled flag.
						if ( isset( $option['enabled'] ) ) {
							$option['enabled'] = filter_var( $option['enabled'], FILTER_VALIDATE_BOOLEAN );
						}
						// Sanitize replace with full menu flag.
						if ( isset( $option['replaceWithFullMenu'] ) ) {
							$option['replaceWithFullMenu'] = filter_var( $option['replaceWithFullMenu'], FILTER_VALIDATE_BOOLEAN );
						}
					}
					break;
				default:
					if ( is_array( $option ) ) {
						$option = Functions::sanitize_array_recursive( $option );
					} else {
						$option = sanitize_text_field( $options[ $key ] );
					}
					break;
			}
		}
		$options = wp_parse_args( $options, $current_options );
		if ( Functions::is_multisite() ) {
			update_site_option( self::$options_key, $options );
		} else {
			update_option( self::$options_key, $options );
		}
		self::$options = $options;
		return $options;
	}

	/**
	 * Return a list of options.
	 *
	 * @param bool $force Whether to get options from cache or not.
	 *
	 * @return array Array of options.
	 */
	public static function get_options( $force = false ) {
		if ( is_array( self::$options ) && ! $force ) {
			return self::$options;
		}
		if ( Functions::is_multisite() ) {
			$options = get_site_option( self::$options_key, array() );
		} else {
			$options = get_option( self::$options_key, array() );
		}

		$defaults      = self::get_defaults();
		$options       = wp_parse_args( $options, $defaults );
		self::$options = $options;
		return $options;
	}

	/**
	 * Get defaults for SCE options
	 *
	 * @since 1.0.0
	 * @access public
	 *
	 * @return array default options
	 */
	public static function get_defaults() {

		$defaults = array(
			'enableAdobeFonts'              => true,
			'enableMarkdownToHeadlineBlock' => false,
			'enablePastePatternProcessing'  => false,
			'enabledPostTypes'              => array(
				'post' => true,
				'page' => true,
			),
			'autoRegenerateStylesPostTypes' => array(),
			'allowedGoogleFonts'            => array(),
			'enableV1Transformations'       => false,
			'enableV1Blocks'                => false,
			'v1CategoryLabel'               => 'GenerateBlocks v1',
			'v2CategoryLabel'               => 'GenerateBlocks v2',
			'v1BlockSuffix'                 => '(v1)',
			'v2BlockSuffix'                 => '(v2)',
			'adminMenuBar'                  => array(
				'enabled'             => true,
				'replaceWithFullMenu' => true,
			),
			'enableFrontendCommandPalette'  => false,
		);
		return $defaults;
	}
}
