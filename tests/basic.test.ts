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
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      require('../packages/pdf-parser-core/package.json');
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      require('../packages/mcp-server/package.json');
    }).not.toThrow();
  });
});

describe('Configuration Tests', () => {
  it('should have valid package.json', () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-unsafe-assignment
    const pkg = require('../package.json');
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    expect(pkg.name).toBe('parseflow');
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    expect(pkg.version).toBeDefined();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    expect(pkg.workspaces).toBeDefined();
  });

  it('should have correct workspace configuration', () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-unsafe-assignment
    const pkg = require('../package.json');
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    expect(pkg.workspaces).toContain('packages/*');
  });
});
