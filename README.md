# Shopify file loader for webpack

Based on webpack's [file-loader](https://github.com/webpack/file-loader) to support Shopify's liquid [URL filters](https://help.shopify.com/themes/liquid/filters/url-filters).

## Usage

The loader follows the same configuration as the original `file-loader`, meaning that all options from the original loader are supported such as the [filename templates](https://github.com/webpack/file-loader#filename-templates).

However, it is important to allow the query string when testing for filenames (notice the `(\?.*)?` below?).

```js
  module: {
    loaders: [
      ...,
      { // Theme Assets
        test: /\/assets\/(.+?)\.(jpe?g|gif|png|woff|woff2|eot|ttf|svg)(\?.*)?$/,
        loader: 'shopify-file?name=assets/[name]-[hash].[ext]'
      }
    ]
  }
```

The following CSS

```css
#foo {
    background-image: url(src/assets/images/bg.png);
}
```

Emits `bg.png` as `assets/bg-0dcbbaa701328a3c262cfd45869e351f.png` in the output directory and returns the liquid tag:

```css
#foo {
    background-image: url({{'bg-3a6f8fc07427621158d3d78d92e20f23.png' | asset_url}});
}
```

Now the CSS file (with `.css.liquid` extension) will include the correct assets URLs.

## Filter parameters

The `asset_url` URL filter is used by default. Other filters can be used as such:

```css
#foo {
    background-image: url(src/assets/images/bg.png?asset_img_url=300x);
    /* emits -> url({{'bg-3a6f8fc07427621158d3d78d92e20f23.png' | asset_img_url: '300x'}}) */

    background-image: url(src/assets/images/bg.png?asset_img_url=300x&crop=bottom);
    /* emits -> url({{'bg-3a6f8fc07427621158d3d78d92e20f23.png' | asset_img_url: '300x', crop: 'bottom'}}) */
}
```