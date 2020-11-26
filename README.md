# `<html-include>`

`<html-include>` is a **web component** that lets you _include_ HTML at one URI into another HTML page.

## Example

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title>Example</title>

		<script src="components/html-include.js"></script>
	</head>

	<body>
		<html-include title="footer" src="partials/header.html"></html-include>

		<p>
			Hello world!
		</p>

		<html-include title="footer" src="partials/footer.html"></html-include>
	</body>
</html>
```

## Basic Usage

The most basic way of using `<html-include>` is:

```html
<html-include src="footer.html"></html-include>
```

```html
<html-include src="includes/header.html"></html-include>
```

```html
<html-include src="path/to/the/file.html"></html-include>
```

Note that in this _basic usage_ we just set the `src` attribute to point to the URI we want to include.

## Advanced Usage

A more advanced way using `<html-include>` is:

```html
<html-include title="footer" src="footer.html" />
```
Note the addition of the ‘title’ attribute.

This usage will show a more informative loading message.
I.e., instead of showing:
> Loading…

… it will show:
> Loading “footer”…

I.e., it includes whatever is in the ‘title’ attribute in the loading-message.

## Debugging

If you need to debug what `<html-include>` is doing you can use the `debug="true"` attribute. For example:

```html
<html-include debug="true" src="footer.html" />
```

```html
<html-include debug="true" title="footer" src="footer.html" />
```

Note the addition of the ‘debug’ attribute, with the value set to the string "true".

This will call console.log() with logs that try to provide inside into what <html-include> is doing internally.
