(function () {
	'use strict';

	// This file is generated by Sapper — do not edit it!
	const timestamp = 1579034434658;

	const files = [
		"service-worker-index.html",
		"favicon.png",
		"logo-192.png",
		"logo-512.png",
		"manifest.json",
		"vendor/document-register-element.js",
		"web_modules/common/_rollupPluginBabelHelpers-1f0d6615.js",
		"web_modules/document-register-element.js",
		"web_modules/import-map.json",
		"web_modules/inert-polyfill.js",
		"web_modules/intersection-observer.js"
	];

	const shell = [
		"client/index.ba1ad9a7.js",
		"client/client.484105aa.js",
		"client/index.29af119a.js",
		"client/index.8d8b19ea.js",
		"client/index.d8db46a8.js",
		"client/new.09ec8686.js",
		"client/[id].f9d0fb2b.js",
		"client/index.2be35e07.js",
		"client/settings.805368e7.js",
		"client/logout.ae922e0e.js",
		"client/login.f0ff0a0f.js",
		"client/sapper-dev-client.89e34bae.js"
	];

	const routes = [
		{ pattern: /^\/$/ },
		{ pattern: /^\/library\/?$/ },
		{ pattern: /^\/library\/([^\/]+?)\/?$/ },
		{ pattern: /^\/library\/([^\/]+?)\/new\/?$/ },
		{ pattern: /^\/library\/([^\/]+?)\/([^\/]+?)\/?$/ },
		{ pattern: /^\/profile\/?$/ },
		{ pattern: /^\/profile\/settings\/?$/ },
		{ pattern: /^\/logout\/?$/ },
		{ pattern: /^\/login\/?$/ }
	];

	/* eslint-env browser, serviceworker */
	console.log(routes);

	const ASSETS = `cache${timestamp}`;

	// `shell` is an array of all the files generated by the bundler,
	// `files` is an array of everything in the `static` directory
	const toCache = shell.concat(files.filter(path => {
	  return !path.startsWith("iAWriterDuo") && !path.includes(".DS_Store")
	}));
	const cached = new Set(toCache);

	self.addEventListener("install", event => {
	  event.waitUntil(
	    caches
	      .open(ASSETS)
	      .then(cache => cache.addAll(toCache))
	      .then(() => {
	        self.skipWaiting();
	      })
	  );
	});

	self.addEventListener("activate", event => {
	  event.waitUntil(
	    caches.keys().then(async keys => {
	      // delete old caches
	      for (const key of keys) {
	        if (key !== ASSETS) await caches.delete(key);
	      }

	      self.clients.claim();
	    })
	  );
	});

	self.addEventListener("fetch", event => {
	  if (event.request.method !== "GET" || event.request.headers.has("range"))
	    return;

	  const url = new URL(event.request.url);

	  // don't try to handle e.g. data: URIs
	  if (!url.protocol.startsWith("http")) return;

	  // ignore dev server requests
	  if (
	    url.hostname === self.location.hostname &&
	    url.port !== self.location.port
	  )
	    return;

	  // always serve static files and bundler-generated assets from cache
	  if (url.host === self.location.host && cached.has(url.pathname)) {
	    event.respondWith(caches.match(event.request));
	    return;
	  }

	  // for pages, you might want to serve a shell `service-worker-index.html` file,
	  // which Sapper has generated for you. It's not right for every
	  // app, but if it's right for yours then uncomment this section
	  // if (
	  //   url.origin === self.origin &&
	  //   routes.find(route => route.pattern.test(url.pathname))
	  // ) {
	  //   event.respondWith(caches.match("/service-worker-index.html"));
	  //   return;
	  // }

	  if (event.request.cache === "only-if-cached") return;

	  // for everything else, try the network first, falling back to
	  // cache if the user is offline. (If the pages never change, you
	  // might prefer a cache-first approach to a network-first one.)
	  event.respondWith(
	    caches.open(`offline${timestamp}`).then(async cache => {
	      try {
	        const response = await fetch(event.request);
	        cache.put(event.request, response.clone());
	        return response;
	      } catch (err) {
	        const response = await cache.match(event.request);
	        if (response) return response;

	        throw err;
	      }
	    })
	  );
	});

}());
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VydmljZS13b3JrZXIuanMiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9ub2RlX21vZHVsZXMvQHNhcHBlci9zZXJ2aWNlLXdvcmtlci5qcyIsIi4uLy4uL3NyYy9zZXJ2aWNlLXdvcmtlci5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBUaGlzIGZpbGUgaXMgZ2VuZXJhdGVkIGJ5IFNhcHBlciDigJQgZG8gbm90IGVkaXQgaXQhXG5leHBvcnQgY29uc3QgdGltZXN0YW1wID0gMTU3OTAzNDQzNDY1ODtcblxuZXhwb3J0IGNvbnN0IGZpbGVzID0gW1xuXHRcInNlcnZpY2Utd29ya2VyLWluZGV4Lmh0bWxcIixcblx0XCJmYXZpY29uLnBuZ1wiLFxuXHRcImxvZ28tMTkyLnBuZ1wiLFxuXHRcImxvZ28tNTEyLnBuZ1wiLFxuXHRcIm1hbmlmZXN0Lmpzb25cIixcblx0XCJ2ZW5kb3IvZG9jdW1lbnQtcmVnaXN0ZXItZWxlbWVudC5qc1wiLFxuXHRcIndlYl9tb2R1bGVzL2NvbW1vbi9fcm9sbHVwUGx1Z2luQmFiZWxIZWxwZXJzLTFmMGQ2NjE1LmpzXCIsXG5cdFwid2ViX21vZHVsZXMvZG9jdW1lbnQtcmVnaXN0ZXItZWxlbWVudC5qc1wiLFxuXHRcIndlYl9tb2R1bGVzL2ltcG9ydC1tYXAuanNvblwiLFxuXHRcIndlYl9tb2R1bGVzL2luZXJ0LXBvbHlmaWxsLmpzXCIsXG5cdFwid2ViX21vZHVsZXMvaW50ZXJzZWN0aW9uLW9ic2VydmVyLmpzXCJcbl07XG5leHBvcnQgeyBmaWxlcyBhcyBhc3NldHMgfTsgLy8gbGVnYWN5XG5cbmV4cG9ydCBjb25zdCBzaGVsbCA9IFtcblx0XCJjbGllbnQvaW5kZXguYmExYWQ5YTcuanNcIixcblx0XCJjbGllbnQvY2xpZW50LjQ4NDEwNWFhLmpzXCIsXG5cdFwiY2xpZW50L2luZGV4LjI5YWYxMTlhLmpzXCIsXG5cdFwiY2xpZW50L2luZGV4LjhkOGIxOWVhLmpzXCIsXG5cdFwiY2xpZW50L2luZGV4LmQ4ZGI0NmE4LmpzXCIsXG5cdFwiY2xpZW50L25ldy4wOWVjODY4Ni5qc1wiLFxuXHRcImNsaWVudC9baWRdLmY5ZDBmYjJiLmpzXCIsXG5cdFwiY2xpZW50L2luZGV4LjJiZTM1ZTA3LmpzXCIsXG5cdFwiY2xpZW50L3NldHRpbmdzLjgwNTM2OGU3LmpzXCIsXG5cdFwiY2xpZW50L2xvZ291dC5hZTkyMmUwZS5qc1wiLFxuXHRcImNsaWVudC9sb2dpbi5mMGZmMGEwZi5qc1wiLFxuXHRcImNsaWVudC9zYXBwZXItZGV2LWNsaWVudC44OWUzNGJhZS5qc1wiXG5dO1xuXG5leHBvcnQgY29uc3Qgcm91dGVzID0gW1xuXHR7IHBhdHRlcm46IC9eXFwvJC8gfSxcblx0eyBwYXR0ZXJuOiAvXlxcL2xpYnJhcnlcXC8/JC8gfSxcblx0eyBwYXR0ZXJuOiAvXlxcL2xpYnJhcnlcXC8oW15cXC9dKz8pXFwvPyQvIH0sXG5cdHsgcGF0dGVybjogL15cXC9saWJyYXJ5XFwvKFteXFwvXSs/KVxcL25ld1xcLz8kLyB9LFxuXHR7IHBhdHRlcm46IC9eXFwvbGlicmFyeVxcLyhbXlxcL10rPylcXC8oW15cXC9dKz8pXFwvPyQvIH0sXG5cdHsgcGF0dGVybjogL15cXC9wcm9maWxlXFwvPyQvIH0sXG5cdHsgcGF0dGVybjogL15cXC9wcm9maWxlXFwvc2V0dGluZ3NcXC8/JC8gfSxcblx0eyBwYXR0ZXJuOiAvXlxcL2xvZ291dFxcLz8kLyB9LFxuXHR7IHBhdHRlcm46IC9eXFwvbG9naW5cXC8/JC8gfVxuXTsiLCIvKiBlc2xpbnQtZW52IGJyb3dzZXIsIHNlcnZpY2V3b3JrZXIgKi9cbmltcG9ydCB7IHRpbWVzdGFtcCwgZmlsZXMsIHNoZWxsLCByb3V0ZXMgfSBmcm9tIFwiQHNhcHBlci9zZXJ2aWNlLXdvcmtlclwiO1xuY29uc29sZS5sb2cocm91dGVzKVxuXG5jb25zdCBBU1NFVFMgPSBgY2FjaGUke3RpbWVzdGFtcH1gO1xuXG4vLyBgc2hlbGxgIGlzIGFuIGFycmF5IG9mIGFsbCB0aGUgZmlsZXMgZ2VuZXJhdGVkIGJ5IHRoZSBidW5kbGVyLFxuLy8gYGZpbGVzYCBpcyBhbiBhcnJheSBvZiBldmVyeXRoaW5nIGluIHRoZSBgc3RhdGljYCBkaXJlY3RvcnlcbmNvbnN0IHRvQ2FjaGUgPSBzaGVsbC5jb25jYXQoZmlsZXMuZmlsdGVyKHBhdGggPT4ge1xuICByZXR1cm4gIXBhdGguc3RhcnRzV2l0aChcImlBV3JpdGVyRHVvXCIpICYmICFwYXRoLmluY2x1ZGVzKFwiLkRTX1N0b3JlXCIpXG59KSk7XG5jb25zdCBjYWNoZWQgPSBuZXcgU2V0KHRvQ2FjaGUpO1xuXG5zZWxmLmFkZEV2ZW50TGlzdGVuZXIoXCJpbnN0YWxsXCIsIGV2ZW50ID0+IHtcbiAgZXZlbnQud2FpdFVudGlsKFxuICAgIGNhY2hlc1xuICAgICAgLm9wZW4oQVNTRVRTKVxuICAgICAgLnRoZW4oY2FjaGUgPT4gY2FjaGUuYWRkQWxsKHRvQ2FjaGUpKVxuICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICBzZWxmLnNraXBXYWl0aW5nKCk7XG4gICAgICB9KVxuICApO1xufSk7XG5cbnNlbGYuYWRkRXZlbnRMaXN0ZW5lcihcImFjdGl2YXRlXCIsIGV2ZW50ID0+IHtcbiAgZXZlbnQud2FpdFVudGlsKFxuICAgIGNhY2hlcy5rZXlzKCkudGhlbihhc3luYyBrZXlzID0+IHtcbiAgICAgIC8vIGRlbGV0ZSBvbGQgY2FjaGVzXG4gICAgICBmb3IgKGNvbnN0IGtleSBvZiBrZXlzKSB7XG4gICAgICAgIGlmIChrZXkgIT09IEFTU0VUUykgYXdhaXQgY2FjaGVzLmRlbGV0ZShrZXkpO1xuICAgICAgfVxuXG4gICAgICBzZWxmLmNsaWVudHMuY2xhaW0oKTtcbiAgICB9KVxuICApO1xufSk7XG5cbnNlbGYuYWRkRXZlbnRMaXN0ZW5lcihcImZldGNoXCIsIGV2ZW50ID0+IHtcbiAgaWYgKGV2ZW50LnJlcXVlc3QubWV0aG9kICE9PSBcIkdFVFwiIHx8IGV2ZW50LnJlcXVlc3QuaGVhZGVycy5oYXMoXCJyYW5nZVwiKSlcbiAgICByZXR1cm47XG5cbiAgY29uc3QgdXJsID0gbmV3IFVSTChldmVudC5yZXF1ZXN0LnVybCk7XG5cbiAgLy8gZG9uJ3QgdHJ5IHRvIGhhbmRsZSBlLmcuIGRhdGE6IFVSSXNcbiAgaWYgKCF1cmwucHJvdG9jb2wuc3RhcnRzV2l0aChcImh0dHBcIikpIHJldHVybjtcblxuICAvLyBpZ25vcmUgZGV2IHNlcnZlciByZXF1ZXN0c1xuICBpZiAoXG4gICAgdXJsLmhvc3RuYW1lID09PSBzZWxmLmxvY2F0aW9uLmhvc3RuYW1lICYmXG4gICAgdXJsLnBvcnQgIT09IHNlbGYubG9jYXRpb24ucG9ydFxuICApXG4gICAgcmV0dXJuO1xuXG4gIC8vIGFsd2F5cyBzZXJ2ZSBzdGF0aWMgZmlsZXMgYW5kIGJ1bmRsZXItZ2VuZXJhdGVkIGFzc2V0cyBmcm9tIGNhY2hlXG4gIGlmICh1cmwuaG9zdCA9PT0gc2VsZi5sb2NhdGlvbi5ob3N0ICYmIGNhY2hlZC5oYXModXJsLnBhdGhuYW1lKSkge1xuICAgIGV2ZW50LnJlc3BvbmRXaXRoKGNhY2hlcy5tYXRjaChldmVudC5yZXF1ZXN0KSk7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgLy8gZm9yIHBhZ2VzLCB5b3UgbWlnaHQgd2FudCB0byBzZXJ2ZSBhIHNoZWxsIGBzZXJ2aWNlLXdvcmtlci1pbmRleC5odG1sYCBmaWxlLFxuICAvLyB3aGljaCBTYXBwZXIgaGFzIGdlbmVyYXRlZCBmb3IgeW91LiBJdCdzIG5vdCByaWdodCBmb3IgZXZlcnlcbiAgLy8gYXBwLCBidXQgaWYgaXQncyByaWdodCBmb3IgeW91cnMgdGhlbiB1bmNvbW1lbnQgdGhpcyBzZWN0aW9uXG4gIC8vIGlmIChcbiAgLy8gICB1cmwub3JpZ2luID09PSBzZWxmLm9yaWdpbiAmJlxuICAvLyAgIHJvdXRlcy5maW5kKHJvdXRlID0+IHJvdXRlLnBhdHRlcm4udGVzdCh1cmwucGF0aG5hbWUpKVxuICAvLyApIHtcbiAgLy8gICBldmVudC5yZXNwb25kV2l0aChjYWNoZXMubWF0Y2goXCIvc2VydmljZS13b3JrZXItaW5kZXguaHRtbFwiKSk7XG4gIC8vICAgcmV0dXJuO1xuICAvLyB9XG5cbiAgaWYgKGV2ZW50LnJlcXVlc3QuY2FjaGUgPT09IFwib25seS1pZi1jYWNoZWRcIikgcmV0dXJuO1xuXG4gIC8vIGZvciBldmVyeXRoaW5nIGVsc2UsIHRyeSB0aGUgbmV0d29yayBmaXJzdCwgZmFsbGluZyBiYWNrIHRvXG4gIC8vIGNhY2hlIGlmIHRoZSB1c2VyIGlzIG9mZmxpbmUuIChJZiB0aGUgcGFnZXMgbmV2ZXIgY2hhbmdlLCB5b3VcbiAgLy8gbWlnaHQgcHJlZmVyIGEgY2FjaGUtZmlyc3QgYXBwcm9hY2ggdG8gYSBuZXR3b3JrLWZpcnN0IG9uZS4pXG4gIGV2ZW50LnJlc3BvbmRXaXRoKFxuICAgIGNhY2hlcy5vcGVuKGBvZmZsaW5lJHt0aW1lc3RhbXB9YCkudGhlbihhc3luYyBjYWNoZSA9PiB7XG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKGV2ZW50LnJlcXVlc3QpO1xuICAgICAgICBjYWNoZS5wdXQoZXZlbnQucmVxdWVzdCwgcmVzcG9uc2UuY2xvbmUoKSk7XG4gICAgICAgIHJldHVybiByZXNwb25zZTtcbiAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGNhY2hlLm1hdGNoKGV2ZW50LnJlcXVlc3QpO1xuICAgICAgICBpZiAocmVzcG9uc2UpIHJldHVybiByZXNwb25zZTtcblxuICAgICAgICB0aHJvdyBlcnI7XG4gICAgICB9XG4gICAgfSlcbiAgKTtcbn0pO1xuIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztDQUFBO0FBQ0EsQ0FBTyxNQUFNLFNBQVMsR0FBRyxhQUFhLENBQUM7O0FBRXZDLENBQU8sTUFBTSxLQUFLLEdBQUc7Q0FDckIsQ0FBQywyQkFBMkI7Q0FDNUIsQ0FBQyxhQUFhO0NBQ2QsQ0FBQyxjQUFjO0NBQ2YsQ0FBQyxjQUFjO0NBQ2YsQ0FBQyxlQUFlO0NBQ2hCLENBQUMscUNBQXFDO0NBQ3RDLENBQUMsMERB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
