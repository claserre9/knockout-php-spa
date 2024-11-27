<?php

namespace App\repositories\redis;

use Redis;

class LipsumRepository
{
    protected Redis $redis;

    public function __construct(Redis $redis)
    {
        $this->redis = $redis;
    }

    public function getData()
    {
        return $this->redis->get("lipsum");
    }


}