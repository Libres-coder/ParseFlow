/**
 * Basic functionality tests
 */

describe('ParseFlow Basic Tests', () => {
  it('should pass basic sanity check', () => {
    expect(true).toBe(true);
  });

  it('should have correct environment', () => {
    expect(process.env.NODE_ENV).toBeDefined();
  });

  it('should import core modules without errors', () => {
    expect(() => {
      // Test that imports don't throw
      require('../packages/pdf-parser-core/package.json');
      require('../packages/mcp-server/package.json');
    }).not.toThrow();
  });
});

describe('Configuration Tests', () => {
  it('should have valid package.json', () => {
    const pkg = require('../package.json');
    expect(pkg.name).toBe('parseflow');
    expect(pkg.version).toBeDefined();
    expect(pkg.workspaces).toBeDefined();
  });

  it('should have correct workspace configuration', () => {
    const pkg = require('../package.json');
    expect(pkg.workspaces).toContain('packages/*');
  });
});
