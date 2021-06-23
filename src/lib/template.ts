import * as Handlebars from 'handlebars/runtime';

import form from '../templates/form.hbs';
import column from '../templates/column.hbs';
import utils from '../templates/utils.hbs';
import enums from '../templates/enums.hbs';
import permission from '../templates/permission.hbs';

export interface Templates {
  form: Handlebars.TemplateDelegate;
  column: Handlebars.TemplateDelegate;
  utils: Handlebars.TemplateDelegate;
  enums: Handlebars.TemplateDelegate;
  permission: Handlebars.TemplateDelegate;
}

/**
 * Read all the Handlebar templates that we need and return on wrapper object
 * so we can easily access the templates in out generator / write functions.
 */
export function registerHandlebarTemplates(): Templates {
  // Main templates (entry points for the files we write to disk)
  const templates: Templates = {
    form: Handlebars.template(form),
    column: Handlebars.template(column),
    utils: Handlebars.template(utils),
    enums: Handlebars.template(enums),
    permission: Handlebars.template(permission),
  };
  return templates;
}
