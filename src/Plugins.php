<?php

namespace Voyager\Admin;

use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Str;
use Voyager\Admin\Contracts\Plugins\IsGenericPlugin;
use Voyager\Admin\Facades\Voyager as VoyagerFacade;

class Plugins
{
    protected $plugins;
    protected $enabled_plugins;
    protected $path;

    public function __construct()
    {
        $this->plugins = collect();
    }

    public function pluginsPath($path)
    {
        $this->path = $path;
    }

    public function addPlugin($plugin = null)
    {
        if (!$this->enabled_plugins) {
            $this->loadEnabledPlugins();
        }
        if ($plugin) {
            if (!is_object($plugin)) {
                $plugin = new $plugin();
            }
            $plugin->type = $this->getPluginType($plugin);

            $plugin->identifier = $plugin->repository.'@'.class_basename($plugin);
            $plugin->enabled = in_array($plugin->identifier, $this->enabled_plugins);
            if ($plugin->getInstructionsView()) {
                $plugin->instructions = $plugin->getInstructionsView()->render();
            }
            $plugin->has_settings = !is_null($plugin->getSettingsView());
            $this->plugins->push($plugin);
        }
    }

    public function loadEnabledPlugins()
    {
        $this->enabled_plugins = [];

        $folder = dirname($this->path);
        VoyagerFacade::ensureDirectoryExists($folder);
        if (!File::exists($this->path)) {
            File::put($this->path, '[]');
        }

        collect(VoyagerFacade::getJson(File::get($this->path), []))->where('enabled')->each(function ($plugin) {
            $this->enabled_plugins[] = $plugin->identifier;
        });
    }

    public function getAllPlugins()
    {
        return collect($this->plugins);
    }

    public function launchPlugins()
    {
        $this->getAllPlugins()->each(function ($plugin, $key) {
            if ($plugin->enabled || $plugin->type == 'theme') {
                $plugin->registerPublicRoutes();
                Route::group(['middleware' => 'voyager.admin'], function () use ($plugin, $key) {
                    $plugin->registerProtectedRoutes();
                });
            }
        });
    }

    public function getPluginByType($type, $fallback = null)
    {
        $plugin = $this->getPluginsByType($type)->where('enabled')->first();
        if (!$plugin && $fallback !== null) {
            $plugin = $fallback;
            if (!($fallback instanceof IsGenericPlugin)) {
                $plugin = new $fallback();
            }
        }

        return $plugin;
    }

    public function getPluginsByType($type)
    {
        return $this->getAllPlugins()->where('type', $type);
    }

    public function getAvailablePlugins()
    {
        return VoyagerFacade::getJson(File::get(realpath(__DIR__.'/../plugins.json')), []);
    }

    public function enablePlugin($identifier, $enable = true)
    {
        $this->getAllPlugins();

        $plugins = collect(VoyagerFacade::getJson(File::get($this->path), []));
        if (!$plugins->contains('identifier', $identifier)) {
            $plugins->push([
                'identifier' => $identifier,
                'enabled'    => $enable,
            ]);
        } else {
            $plugins->where('identifier', $identifier)->first()->enabled = $enable;
        }

        return File::put($this->path, json_encode($plugins, JSON_PRETTY_PRINT));
    }

    public function disablePlugin($identifier)
    {
        return $this->enablePlugin($identifier, false);
    }

    protected function getPluginType($class)
    {
        return collect(class_implements($class))->filter(function ($interface) {
            return Str::startsWith($interface, 'Voyager\\Admin\\Contracts\\Plugins\\');
        })->transform(function ($interface) {
            return strtolower(str_replace(['Voyager\\Admin\\Contracts\\Plugins\\', 'Plugin', 'Is'], '', $interface));
        })->first();
    }
}
