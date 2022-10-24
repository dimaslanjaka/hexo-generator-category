'use strict';

const { writeFileSync } = require('fs');
const pagination = require('hexo-pagination');
const { join } = require('path');
const { inspect } = require('util');

/**
 *
 * @param {import('hexo').Locals} locals
 * @returns
 */
function generator(locals) {
  const config = this.config;
  const perPage = config.category_generator.per_page;
  const paginationDir = config.pagination_dir || 'page';
  const orderBy = config.category_generator.order_by || '-date';

  /**
   * @type {import('hexo').Locals.Category}
   */
  const categories = locals.categories;
  writeFileSync(join(__dirname, 'categories.log'), inspect(categories));

  const returns = categories.reduce((result, category) => {
    if (!category.length) return result;
    writeFileSync(join(__dirname, 'result.log'), inspect(result));

    const posts = category.posts.sort(orderBy);
    const data = pagination(category.path, posts, {
      perPage,
      layout: ['category', 'archive', 'index'],
      format: paginationDir + '/%d/',
      data: {
        category: category.name
      }
    });

    return result.concat(data);
  }, []);
  writeFileSync(join(__dirname, 'returns.log'), inspect(returns));
  return returns;
}

module.exports = generator;
