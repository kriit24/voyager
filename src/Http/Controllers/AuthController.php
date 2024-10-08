<?php

namespace Voyager\Admin\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Event;
use Inertia\Response as InertiaResponse;
use Voyager\Admin\Facades\Voyager as VoyagerFacade;

class AuthController extends Controller
{
    public function login(Request $request): InertiaResponse|RedirectResponse
    {
        Event::dispatch('voyager.page');
        $errors = [];
        $auth = VoyagerFacade::auth();
        if ($auth->user()) {
            return redirect($auth->redirectTo());
        }

        if ($request->method() == 'POST') {
            $result = $auth->authenticate($request);
            if ($result == null) {
                return redirect()->intended($auth->redirectTo());
            } else {
                $errors = $result;
            }
        }

        return $this->inertiaRender('Login', __('voyager::auth.login'), [
            'welcome'           => VoyagerFacade::setting('admin.welcome', __('voyager::generic.welcome_to_voyager')),
            'hasPasswordView'   => VoyagerFacade::auth()->forgotPasswordView(),
            'loginComponent'    => VoyagerFacade::auth()->loginComponent(),
            'errors'            => $errors,
            'data'              => $request->all(),
        ]);
    }

    public function logout(): RedirectResponse
    {
        return VoyagerFacade::auth()->logout();
    }

    public function forgotPassword(Request $request): RedirectResponse
    {
        Event::dispatch('voyager.page');

        return VoyagerFacade::auth()->forgotPassword($request);
    }
}
