(function (window, $) {
    var multiple_selector = function (init_data) {
        this.init_data = init_data;
        this.init = function () {
            let left_obj = multiple_selector.getActionObj(this.init_data.obj, 'left');
            this.init_data.left_origin_data = $.extend(true, {}, this.init_data.left_data);
            multiple_selector.assignmentObj(left_obj, this.init_data.left_data);
            let right_obj = multiple_selector.getActionObj(this.init_data.obj, 'right');
            this.init_data.right_origin_data = $.extend(true, {}, this.init_data.right_data);
            multiple_selector.assignmentObj(right_obj, this.init_data.right_data);
            $('#' + this.init_data.id + '-' + this.init_data.target).bind('change', {
                obj: this.init_data.obj,
                target: this.init_data.target
            }, multiple_selector.inputAssignment);
            $('#' + this.init_data.id + '-left-search').bind('keyup', {
                obj: this.init_data.obj,
                target: 'left'
            }, multiple_selector.select_search);
            $('#' + this.init_data.id + '-right-search').bind('keyup', {
                obj: this.init_data.obj,
                target: 'right'
            }, multiple_selector.select_search);
            $('#' + this.init_data.id + '-to-' + 'left').bind('click', {
                obj: this.init_data.obj,
                form: 'right',
                target: 'left'
            }, multiple_selector.to_select);
            $('#' + this.init_data.id + '-to-' + 'right').bind('click', {
                obj: this.init_data.obj,
                form: 'left',
                target: 'right'
            }, multiple_selector.to_select);
            $('#' +
                this.init_data.id +
                '-' +
                'reset').bind('click', {
                obj: this.init_data.obj,
                target: this.init_data.target
            }, multiple_selector.restart)

        }
        //重置多选
        multiple_selector.restart = function (event) {
            window[event.data.obj].init_data.left_data = $.extend(true, [], window[event.data.obj].init_data.left_origin_data);
            multiple_selector.assignmentObj(multiple_selector.getActionObj(event.data.obj, 'left'), window[event.data.obj].init_data.left_data);
            window[event.data.obj].init_data.right_data = $.extend(true, [], window[event.data.obj].init_data.right_origin_data);
            multiple_selector.assignmentObj(multiple_selector.getActionObj(event.data.obj, 'right'), window[event.data.obj].init_data.right_data);
            var obj = multiple_selector.getActionObj(event.data.obj, event.data.target);
            multiple_selector.getActionObj(event.data.obj, event.data.target).change();
            let left_search_obj = multiple_selector.getActionObj(event.data.obj, 'left-search');
            left_search_obj.val('');
            let right_search_obj = multiple_selector.getActionObj(event.data.obj, 'right-search');
            right_search_obj.val('');
        }
        //获取操作的元素
        multiple_selector.getActionObj = function (obj, type) {
            let id = window[obj].init_data.id;
            return $('#' + id + '-' + type);
        }
        //select 赋值
        multiple_selector.assignmentObj = function (obj, opts) {
            obj.html('');
            for (var i in opts) {
                if (opts[i]) {
                    $('<option>').text(opts[i]).val(opts[i]).appendTo(obj);
                }

            }

        }
        multiple_selector.to_select = function (event) {
            let form_obj = multiple_selector.getActionObj(event.data.obj, event.data.form);
            let target_obj = multiple_selector.getActionObj(event.data.obj, event.data.target);
            let form_val = multiple_selector.getSelectedOptions(form_obj);
            let target_val = multiple_selector.getSelectedOptions(target_obj, true);
            let is_change = false;
            for (var i in form_val) {
                if (target_val.length == 0 || target_val.indexOf(form_val[i]) == -1) {
                    is_change = true;
                    $('<option>').text(form_val[i]).val(form_val[i]).appendTo(target_obj);
                    window[event.data.obj].init_data[event.data.target + '_data'].push(form_val[i]);
                    console.log(window[event.data.obj].init_data[event.data.form + '_data']);
                    let index = window[event.data.obj].init_data[event.data.form + '_data'].indexOf(form_val[i]);
                    window[event.data.obj].init_data[event.data.form + '_data'].splice(index, 1);
                }
            }
            if (is_change) {
                multiple_selector.assignmentObj(form_obj, window[event.data.obj].init_data[event.data.form + '_data']);
                multiple_selector.getActionObj(event.data.obj, window[event.data.obj].init_data.target).change();
            }
        }
        multiple_selector.getSelectedOptions = function (obj, is_all) {
            let res = [];
            for (let i = 0; i < obj[0].options.length; i++) {
                if (obj[0].options[i].selected || is_all) {
                    res.push(String(obj[0].options[i].value));
                }

            }
            return res;
        }
        //select 搜索
        multiple_selector.select_search = function (event) {
            let search_val = $(this).val();
            var target = multiple_selector.getActionObj(event.data.obj, event.data.target);
            let has_flag = false;
            if (search_val) {
                for (var i in window[event.data.obj].init_data[event.data.target + '_data']) {
                    let opt = window[event.data.obj].init_data[event.data.target + '_data'][i];
                    if (opt.indexOf(search_val) > -1) {
                        if (!has_flag) {
                            target.html('');
                        }
                        $('<option>').text(opt).val(opt).appendTo(target);
                        has_flag = true;
                    }
                }
                if (has_flag == false) {
                    target.html('');
                }
            } else {
                multiple_selector.assignmentObj(target, window[event.data.obj].init_data[event.data.target + '_data']);
            }
        }
        //目标表单赋值
        multiple_selector.inputAssignment = function (event) {
            var form_input_vals = multiple_selector.getSelectedOptions(multiple_selector.getActionObj(event.data.obj, event.data.target), true);
            $('#' + window[event.data.obj].init_data.id).val(JSON.stringify(form_input_vals));
        }
        //外部控制组件是否可用
        multiple_selector.action_component=function (obj,is_active = false) {
            multiple_selector.restart({data:{obj:obj,target:window[obj].init_data.target}});
            $('#' + window[obj].init_data.id).attr('disabled',!is_active);
            multiple_selector.getActionObj(obj,'left').attr('disabled',!is_active);
            multiple_selector.getActionObj(obj,'left-search').attr('disabled',!is_active);
            multiple_selector.getActionObj(obj,'right').attr('disabled',!is_active);
            multiple_selector.getActionObj(obj,'right-search').attr('disabled',!is_active);
        }
    }
    window.multiple_selector = multiple_selector;
})(window, $);