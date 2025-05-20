# Changelog

All notable changes to the NehoID library will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2025-05-20

### Changed
- Renamed `consciousnessEmbedded` method to `patternEmbedded` for more professional terminology
- Updated `prophetic` method to `predictiveSequence` with improved time-series based implementation
- Refactored V2 implementation to use static class methods instead of instance methods
- Updated documentation to use `NehoId` instead of `NehoIDV2` in examples for consistency

### Fixed
- Resolved circular inheritance issues between NehoID and NehoIDV2 classes
- Fixed static method references in V2 implementation to use class names instead of `this`
- Removed all mock implementations in favor of real, functional implementations
- Ensured all methods use Generator.nano() for consistent ID generation

### Added
- Comprehensive test suite for all V2 advanced features
- Added `nanoid` method to NehoIDV2 that calls Generator.nano
- Enhanced README with detailed V2 feature documentation

## [1.0.1] - 2025-05-19

### Fixed
- Express dependency conflict by making it an optional peer dependency
- Updated Rollup to v3 and related plugins for better TypeScript declaration file generation
- Fixed circular dependencies in integration modules

### Added
- Comprehensive test file for all features
- Better TypeScript type declarations

## [1.0.0] - 2025-05-15

### Added
- Initial release with full implementation of all promised features
- Core ID generation functionality
  - Basic ID generation
  - UUID generation
  - NanoID generation
  - Short ID generation
  - Hex ID generation
- Specialized ID generators
  - Hierarchical IDs
  - Temporal IDs
  - Sequential IDs
- Context-aware ID generation
  - Device-aware IDs
  - Location-based IDs (with privacy protection)
  - User behavior integration
- Semantic ID generation
- Collision detection and prevention
- Batch operations
- ID validation and health checks
- Performance monitoring
- ID migration tools
- Cross-platform compatibility
- Framework integrations
  - Express middleware
  - Mongoose integration
  - Sequelize integration
  - TypeORM integration
- Advanced encoding pipeline

### Security
- Implemented privacy-focused location hashing
- Added secure random generation for all ID types
- Ensured no sensitive data is exposed in generated IDs

## [0.9.0] - 2025-05-01

### Added
- Beta release for internal testing
- Core functionality implemented
- Initial documentation

### Known Issues
- Some mock implementations that needed to be replaced
- Incomplete framework integrations