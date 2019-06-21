<?php
namespace ccheng\multipleselector;

/**
 * Created by PhpStorm.
 * User: fishes
 * Date: 2019/5/10
 * Time: 15:31
 */

use yii\web\AssetBundle;
use yii\web\View;

class MultipleSelectorAsset extends AssetBundle
{
    public $css       = [];
    public $jsOptions = [
        'position' => View::POS_HEAD,
    ];
    public $js        = [
        'js/multiple_selector.js',
    ];
    public $depends   = ['yii\web\JqueryAsset'];

    public function init()
    {
        $this->sourcePath = dirname(__DIR__) . '/assets';
        parent::init(); // TODO: Change the autogenerated stub
    }
}