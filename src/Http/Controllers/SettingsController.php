<?php

namespace Voyager\Admin\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Response as InertiaResponse;
use Voyager\Admin\Manager\Settings as SettingsManager;

class SettingsController extends Controller
{
    public function __construct(protected SettingsManager $settingmanager)
    {
        parent::__construct();
    }

    public function index(): InertiaResponse
    {
        return $this->inertiaRender('Settings', __('voyager::generic.settings'), [
            'input' => $this->settingmanager->get(),
        ]);
    }

    public function store(Request $request): \Illuminate\Http\Response|\Illuminate\Http\JsonResponse
    {
        // Push a fake column object to settings
        $settings = collect($request->get('settings', []))->transform(function ($setting) {
            $setting = (object) $setting;
            foreach ($setting->validation as $key => $rule) {
                $setting->validation[$key] = (object) $rule;
            }
            $key = $setting->key;
            if (!empty($setting->group)) {
                $key = implode('.', [$setting->group, $setting->key]);
            }
            $setting->column = (object) ['column' => $key];

            return $setting;
        });
        // Prepare a data-array which is readable
        $data = $settings->mapWithKeys(function ($setting) {
            return [$setting->column->column => $setting->value];
        });
        $validation_errors = $this->validateData($settings, $data);

        $settings->each(function ($setting) use (&$validation_errors) {
            if (!$setting->key || $setting->key == '') {
                $validation_errors[$setting->group.'.'] = true;
            }
        });

        if (count($validation_errors) > 0) {
            return response()->json($validation_errors, 422);
        }
        $this->settingmanager->save($request->get('settings', '[]'));

        return response('', 200);
    }
}
