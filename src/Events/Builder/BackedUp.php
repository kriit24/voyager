<?php

namespace Voyager\Admin\Events\Builder;

use Voyager\Admin\Classes\Bread;

class BackedUp
{
    public Bread $bread;

    /**
     * Create a new event instance.
     *
     * @param  \Voyager\Admin\Classes\Bread  $bread
     * @return void
     */
    public function __construct(Bread $bread)
    {
        $this->bread = $bread;
    }
}
