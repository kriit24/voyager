<?php

namespace Voyager\Admin\Classes;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Collection;
use Illuminate\Database\Eloquent\SoftDeletes;
use Voyager\Admin\Traits\Translatable;

/**
 * Dynamically casted to strings by Translatable Trait
 * 
 * @property string $slug
 * @property string $name_singular
 * @property string $name_plural
 */

class Bread implements \JsonSerializable
{
    use Translatable;

    private array $translatable = ['slug', 'name_singular', 'name_plural'];

    public string $table = '';
    protected mixed $slug = null;
    protected mixed $name_singular = null;
    protected mixed $name_plural = null;
    public string $icon = 'bread';
    public mixed $model = null;
    public mixed $controller = null;
    public mixed $policy = null;
    public mixed $global_search_field = null;
    public mixed $order_field = null;
    public ?string $badge_color = null;
    public Collection $layouts;
    public Collection $relationships;

    protected mixed $model_class = null;

    /**
     * Construct a BREAD class based on JSON input
     */
    public function __construct(mixed $json)
    {
        $this->layouts = collect();
        $this->relationships = collect();

        collect($json)->each(function ($value, $key) {
            if ($key == 'layouts') {
                foreach ($value as $layout) {
                    $layout = new Layout($layout, $this);
                    $this->layouts->push($layout);
                }
            } else {
                $this->{$key} = $value;
            }
        });
    }

    /**
     * Get an instance of the BREADs model.
     */
    public function getModel(): Model
    {
        if (!$this->model_class) {
            $this->model_class = app($this->model);
        }

        return $this->model_class;
    }

    /**
     * Gets if the model/BREAD uses the translatable Trait.
     */
    public function usesTranslatableTrait(): bool
    {
        $traits = class_uses($this->getModel());
        if ($traits !== false) {
            return in_array(Translatable::class, $traits);
        }
        
        return false;
    }

    /**
     * Gets if the model/BREAD uses the soft-delete trait.
     */
    public function usesSoftDeletes(): bool
    {
        $traits = class_uses($this->getModel());
        if ($traits !== false) {
            return in_array(SoftDeletes::class, $traits);
        }

        return false;
    }

    public function jsonSerialize(): array
    {
        return [
            'table'               => $this->table,
            'slug'                => $this->slug,
            'name_singular'       => $this->name_singular,
            'name_plural'         => $this->name_plural,
            'icon'                => $this->icon,
            'model'               => $this->model,
            'controller'          => $this->controller,
            'policy'              => $this->policy,
            'global_search_field' => $this->global_search_field,
            'order_field'         => $this->order_field,
            'badge_color'         => $this->badge_color,
            'layouts'             => $this->layouts,
        ];
    }
}
