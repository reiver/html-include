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

```
<html-include src="footer.html"></html-include>
```

```
<html-include src="includes/header.html"></html-include>
```

```
<html-include src="path/to/the/file.html"></html-include>
```

Note that in this _basic usage_ we just set the `src` attribute to point to the URI we want to include.

