<?php

namespace ccheng\multipleselector;

/**
 * 左右多选组件
 * Created by PhpStorm.
 * User: fishes
 * Date: 2019/5/10
 * Time: 14:59
 */
use yii\base\InvalidConfigException;
use yii\helpers\Html;
use yii\widgets\InputWidget;
use yii\web\View;

class MultipleSelector extends InputWidget
{
    public $left_data = [];

    public $right_data = [];

    public $target;

    const TARGET_MAP = ['left', 'right'];

    public function run()
    {
        if (!in_array($this->target, self::TARGET_MAP)) {
            throw new InvalidConfigException('Invalid value for the property "target"');
        }
        $this->registerClientJs();
        return $this->renderInput();
    }

    protected function renderInput()
    {
        $inputHtml  = $this->renderInputHtml('hidden');
        $id         = $this->options['id'] ?? 'm';
        $reset_html = Html::a('<i class="glyphicon glyphicon-refresh glyphicon-refresh-animate"></i>', 'javascript:void(0);', [
            'class' => 'btn btn-danger',
            'id'    => $id.'-reset',
            'title' => '重置',
        ]);
        $to_right_html=Html::a('&gt;&gt;', 'javascript:void(0);', [
        'class' => 'btn btn-success',
        'id' => $id.'-to-right',
        'title' => '分配至右侧',
    ]);
        $to_left_html=Html::a('&lt;&lt;', 'javascript:void(0);', [
        'class' => 'btn btn-success',
        'id' =>$id.'-to-left',
        'title' => '分配至左侧',
    ]);
        $disabled=$this->options['disabled']?'disabled':'';
        return <<<HTML
        
            <div class="row">
            $inputHtml
    <div class="col-sm-5">
        <input class="form-control search" id="$id-left-search" $disabled
                   placeholder="搜索左侧">
        <select multiple size="20" class="form-control list" id="$id-left" $disabled></select>
    </div>
    <div class="col-sm-1" style="text-align: center">
        <br><br>
        $reset_html
        <br><br>
        $to_right_html
        <br><br>
        $to_left_html
    </div>
    <div class="col-sm-5">
        <input class="form-control search" id="$id-right-search" $disabled 
               placeholder="搜索右侧">
        <select multiple size="20" class="form-control list" id="$id-right" $disabled></select>
    </div>
</div>
HTML;
    }

    public function registerClientJs()
    {

        $view = $this->getView();
        MultipleSelectorAsset::register($view);
        $init_data               = [];
        $id                      = $this->options['id'];
        $init_data['id']         = $id;
        $init_data['disabled']         = (String)$this->options['disabled'];
        $init_data['readonly']         = (String)$this->options['readonly'];
        $init_data['target']     = $this->target;
        $init_data['obj']        = 'multiple_selector_obj_' . $id;
        $init_data['left_data']  = $this->left_data;
        $init_data['right_data'] = $this->right_data;
        $init_data_val           = json_encode($init_data);
        $js                      = <<<JS
            $(function(){
                window.multiple_selector_obj_$id=new multiple_selector($init_data_val);
                window.multiple_selector_obj_$id.init();
            });
            
JS;

        $view->registerJs($js, View::POS_READY);

    }
}