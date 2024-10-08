import{_ as e,c as a,o as t,a as o}from"./app.e6a18615.js";const v='{"title":"Contributing","description":"","frontmatter":{},"headers":[{"level":2,"title":"Tests","slug":"tests"},{"level":2,"title":"Coverage","slug":"coverage"},{"level":2,"title":"Developing Javascript and CSS","slug":"developing-javascript-and-css"},{"level":2,"title":"Breaking changes","slug":"breaking-changes"}],"relativePath":"contributing/index.md"}',n={},r=o('<h1 id="contributing" tabindex="-1">Contributing <a class="header-anchor" href="#contributing" aria-hidden="true">#</a></h1><p>Thanks for contributing to Voyager!<br> Here are some important things to keep in mind:</p><h2 id="tests" tabindex="-1">Tests <a class="header-anchor" href="#tests" aria-hidden="true">#</a></h2><p>It is important to provide testing for all newly introduced code if possible.</p><h2 id="coverage" tabindex="-1">Coverage <a class="header-anchor" href="#coverage" aria-hidden="true">#</a></h2><p>We let <a href="https://codeclimate.com/github/voyager-admin/voyager" target="_blank" rel="noopener noreferrer">code climate</a> check our test coverage.</p><h2 id="developing-javascript-and-css" tabindex="-1">Developing Javascript and CSS <a class="header-anchor" href="#developing-javascript-and-css" aria-hidden="true">#</a></h2><p>If you want to change anything related to Javascript and/or CSS, you can make your life easier by using hot module reloading.<br> Hot module reload allows you to change code and instantly see the changes you made without the need to reload your browser window or clearing your cache.</p><p>To do so, you first have to install all NPM modules by running <code>npm install</code>.<br> After that run <code>npm run watch</code> to provide a dev-server serving the compiled assets.<br> Now you can enable using this server by calling the command <code>php artisan voyager:dev --enable</code> or by going to the <code>Settings =&gt; Admin</code> and changing the <code>Dev-Server</code> setting to <code>Yes</code>.</p><p>When you are done, you can simply change the setting to <code>No</code>, call <code>php artisan voyager:dev --disable</code> or click <code>Disable</code> on the notification that appears when your dev-server becomes unavailable.</p><h2 id="breaking-changes" tabindex="-1">Breaking changes <a class="header-anchor" href="#breaking-changes" aria-hidden="true">#</a></h2><p>...</p>',12),i=[r];function s(c,d,l,h,g,p){return t(),a("div",null,i)}var b=e(n,[["render",s]]);export{v as __pageData,b as default};
