import { registerHandlebarTemplates } from './template';

describe('registerHandlebarTemplates', () => {
  it('should return correct templates', () => {
    const templates = registerHandlebarTemplates();
    expect(templates.column).toBeDefined();
    expect(templates.form).toBeDefined();
  });
});
