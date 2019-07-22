<template>
  <div>
    <!-- 顶部面包屑 -->
    <mybread nav1="商品管理" nav2="分类参数"></mybread>
    <!-- alert -->
    <el-alert title="注意 : 只允许为第三级分类设置相关参数!" type="warning" show-icon class="myalert"></el-alert>
    <!-- 级联选择器 -->
    请选择商品分类 :
    <el-cascader
      v-model="value"
      :options="options"
      :props="{ expandTrigger: 'hover',
            value:'cat_id',
            label:'cat_name' }"
      placeholder="请选择商品分类"
      class="mycascder"
      @change="handleChange"
    ></el-cascader>
    <!-- tab -->
    <el-tabs v-model="activeName" @tab-click="handleClick" class="mytab">
      <el-tab-pane label="动态参数" name="first">
        <el-button
          type="primary"
          :disabled="btn"
          class="mybtn"
          @click="dialogFormVisible=true"
        >添加动态参数</el-button>
        <el-table :data="dnyTableData" border style="width: 100%">
          <el-table-column type="expand">
            <template slot-scope="scope">
              <el-tag
                :key="tag"
                v-for="tag in scope.row.attr_vals"
                closable
                :disable-transitions="false"
                @close="handleClose(tag,scope.row.attr_vals)"
                class="my-tag"
              >{{tag}}</el-tag>
              <!-- 动态编辑tag -->
              <el-input
                class="input-new-tag"
                v-if="inputVisible"
                v-model="inputValue"
                ref="saveTagInput"
                size="small"
                @keyup.enter.native="handleInputConfirm(scope.row.attr_vals)"
                @blur="handleInputConfirm(scope.row.attr_vals)"
              ></el-input>
              <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
            </template>
          </el-table-column>
          <el-table-column type="index" width="50"></el-table-column>
          <el-table-column prop="attr_name" label="商品参数" width="200"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="primary" plain icon="el-icon-edit" size="mini"></el-button>
              <el-button type="danger" plain icon="el-icon-delete" size="mini"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="静态参数" name="second">
        <el-button type="primary" :disabled="btn" class="mybtn" @click='staFormVisible=true'>添加静态参数</el-button>
        <el-table :data="staTableData" border style="width: 100%">
          <el-table-column type="index" width="50"></el-table-column>
          <el-table-column prop="attr_name" label="属性名称" width="200"></el-table-column>
          <el-table-column prop="attr_vals" label="属性值" width="700"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="primary" plain icon="el-icon-edit" size="mini"></el-button>
              <el-button type="danger" plain icon="el-icon-delete" size="mini"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>

    <!-- 添加动态参数对话框 -->
    <el-dialog title="添加动态参数" :visible.sync="dialogFormVisible">
      <el-form :model="manyForm" :rules="rules" ref="ruleForm">
        <el-form-item label="动态参数" label-width="120px" prop="name">
          <el-input v-model="manyForm.many" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 添加静态参数对话框 -->
    <el-dialog title="添加静态参数" :visible.sync="staFormVisible">
      <el-form :model="onlyForm" :rules="rules" ref="ruleForm">
        <el-form-item label="静态参数" label-width="120px" prop="name">
          <el-input v-model="onlyForm.only" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="静态参数值" label-width="120px" prop="value">
          <el-input v-model="onlyForm.only" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="staFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="staFormVisible = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getCategoriesT, getParamsSta, getParamsDny } from "../api/http";
export default {
  name: "params",
  data() {
    return {
      //添加静态参数对话框
      staFormVisible:false,
      //添加静态参数数据
      onlyForm: {
        only: ""
      },
      //添加动态参数对话框
      dialogFormVisible: false,
      //添加动态参数数据
      manyForm: {
        many: ""
      },
      //验证规则
      rules: {
        name: [{ required: true, message: "请输入参数名称", trigger: "blur" }],
        value: [{ required: true, message: "请输入参数值", trigger: "blur" }]
      },
      //tab数据绑定 默认选中第一个
      activeName: "first",
      //table数据
      value: [],
      //静态table数据
      staTableData: [],
      //添加参数btn是否启用
      btn: true,
      //动态table数据
      dnyTableData: [],
      //动态编辑tag
      inputVisible: false,
      inputValue: "",
      //级联选择器数据
      options: [
        {
          value: "zhinan",
          label: "指南",
          children: [
            {
              value: "shejiyuanze",
              label: "设计原则",
              children: [
                {
                  value: "yizhi",
                  label: "一致"
                },
                {
                  value: "fankui",
                  label: "反馈"
                },
                {
                  value: "xiaolv",
                  label: "效率"
                },
                {
                  value: "kekong",
                  label: "可控"
                }
              ]
            },
            {
              value: "daohang",
              label: "导航",
              children: [
                {
                  value: "cexiangdaohang",
                  label: "侧向导航"
                },
                {
                  value: "dingbudaohang",
                  label: "顶部导航"
                }
              ]
            }
          ]
        },
        {
          value: "zujian",
          label: "组件",
          children: [
            {
              value: "basic",
              label: "Basic",
              children: [
                {
                  value: "layout",
                  label: "Layout 布局"
                },
                {
                  value: "color",
                  label: "Color 色彩"
                },
                {
                  value: "typography",
                  label: "Typography 字体"
                },
                {
                  value: "icon",
                  label: "Icon 图标"
                },
                {
                  value: "button",
                  label: "Button 按钮"
                }
              ]
            },
            {
              value: "form",
              label: "Form",
              children: [
                {
                  value: "radio",
                  label: "Radio 单选框"
                },
                {
                  value: "checkbox",
                  label: "Checkbox 多选框"
                },
                {
                  value: "input",
                  label: "Input 输入框"
                },
                {
                  value: "input-number",
                  label: "InputNumber 计数器"
                },
                {
                  value: "select",
                  label: "Select 选择器"
                },
                {
                  value: "cascader",
                  label: "Cascader 级联选择器"
                },
                {
                  value: "switch",
                  label: "Switch 开关"
                },
                {
                  value: "slider",
                  label: "Slider 滑块"
                },
                {
                  value: "time-picker",
                  label: "TimePicker 时间选择器"
                },
                {
                  value: "date-picker",
                  label: "DatePicker 日期选择器"
                },
                {
                  value: "datetime-picker",
                  label: "DateTimePicker 日期时间选择器"
                },
                {
                  value: "upload",
                  label: "Upload 上传"
                },
                {
                  value: "rate",
                  label: "Rate 评分"
                },
                {
                  value: "form",
                  label: "Form 表单"
                }
              ]
            },
            {
              value: "data",
              label: "Data",
              children: [
                {
                  value: "table",
                  label: "Table 表格"
                },
                {
                  value: "tag",
                  label: "Tag 标签"
                },
                {
                  value: "progress",
                  label: "Progress 进度条"
                },
                {
                  value: "tree",
                  label: "Tree 树形控件"
                },
                {
                  value: "pagination",
                  label: "Pagination 分页"
                },
                {
                  value: "badge",
                  label: "Badge 标记"
                }
              ]
            },
            {
              value: "notice",
              label: "Notice",
              children: [
                {
                  value: "alert",
                  label: "Alert 警告"
                },
                {
                  value: "loading",
                  label: "Loading 加载"
                },
                {
                  value: "message",
                  label: "Message 消息提示"
                },
                {
                  value: "message-box",
                  label: "MessageBox 弹框"
                },
                {
                  value: "notification",
                  label: "Notification 通知"
                }
              ]
            },
            {
              value: "navigation",
              label: "Navigation",
              children: [
                {
                  value: "menu",
                  label: "NavMenu 导航菜单"
                },
                {
                  value: "tabs",
                  label: "Tabs 标签页"
                },
                {
                  value: "breadcrumb",
                  label: "Breadcrumb 面包屑"
                },
                {
                  value: "dropdown",
                  label: "Dropdown 下拉菜单"
                },
                {
                  value: "steps",
                  label: "Steps 步骤条"
                }
              ]
            },
            {
              value: "others",
              label: "Others",
              children: [
                {
                  value: "dialog",
                  label: "Dialog 对话框"
                },
                {
                  value: "tooltip",
                  label: "Tooltip 文字提示"
                },
                {
                  value: "popover",
                  label: "Popover 弹出框"
                },
                {
                  value: "card",
                  label: "Card 卡片"
                },
                {
                  value: "carousel",
                  label: "Carousel 走马灯"
                },
                {
                  value: "collapse",
                  label: "Collapse 折叠面板"
                }
              ]
            }
          ]
        },
        {
          value: "ziyuan",
          label: "资源",
          children: [
            {
              value: "axure",
              label: "Axure Components"
            },
            {
              value: "sketch",
              label: "Sketch Templates"
            },
            {
              value: "jiaohu",
              label: "组件交互文档"
            }
          ]
        }
      ]
    };
  },
  methods: {
    //动态tag事件
    showInput() {
      this.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },

    handleInputConfirm(arr) {
      let inputValue = this.inputValue;
      if (inputValue) {
        arr.push(inputValue);
      }
      this.inputVisible = false;
      this.inputValue = "";
    },

    //tag关闭事件
    handleClose(tag, arr) {
      arr.splice(arr.indexOf(tag), 1);
    },
    //级联选择器改变触发事件
    handleChange(value) {
      // console.log(value);
      //获取最后一级的id发送请求
      // console.log(value[value.length-1]);
      const id = value[value.length - 1];
      //获取静态态数据
      getParamsSta({ id }).then(backData => {
        // console.log(backData)
        if (backData.data.meta.status == 200) {
          this.staTableData = backData.data.data;
        }
      });
      //获取动态参数
      getParamsDny({ id }).then(backData => {
        // console.log(backData)
        if (backData.data.meta.status == 200) {
          this.dnyTableData = backData.data.data;
          for (let i = 0; i < backData.data.data.length; i++) {
            backData.data.data[i].attr_vals = backData.data.data[
              i
            ].attr_vals.split(",");
          }
        }
      });
      this.btn = false;
    },
    handleClick(tab, event) {
      console.log(tab, event);
    }
  },
  created() {
    //一进来获取分类列表渲染到级联选择器中
    getCategoriesT().then(backData => {
      // console.log(backData)
      if (backData.data.meta.status == 200) {
        this.options = backData.data.data;
      }
    });
  }
};
</script>

<style lang='less' scoped>
.myalert {
  margin: 20px 0;
}
.mycascder {
  margin-left: 10px;
}
.mytab {
  margin-top: 20px;
  .mybtn {
    margin-bottom: 15px;
  }
  .my-tag {
    margin-right: 10px;
    margin-bottom: 10px;
  }
}

.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
