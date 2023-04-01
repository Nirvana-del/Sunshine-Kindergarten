<script lang="ts">
export default {
  name: 'user'
};
</script>

<script setup lang="ts">
import {UserForm, UserPageVO} from '@/api/user/types';
import {
  adminHandleComplaintsApi, complainApi,
  deleteComplaintsApi,
  getComplaintsApi, getComplaintsByStatusApi,
  getComplaintsListApi,
  userGetComplaintsApi, userGetComplaintsByStatusApi
} from "@/api/complaints";
import {useUserStoreHook} from "@/store/modules/user";

const {roles} = useUserStoreHook()
console.log(roles)
const resFormRef = ref(ElForm); // 用户表单
const complainFormRef = ref(ElForm); // 用户表单

const queryParams = reactive({
  status: ''
});
const loading = ref(false);
const ids = ref([]);
const dialog = reactive<DialogOption>({
  visible: false
});

const dialog2 = reactive<DialogOption>({
  visible: false
});

const dialog3 = reactive<DialogOption>({
  visible: false
});
const queryFormRef = ref(ElForm); // 查询表单

const complaintsList = ref<UserPageVO[]>();

const formData = reactive<UserForm>({
  status: 1
});
const formData2 = reactive<UserForm>({});
const formData3 = reactive<any>({});

const rules = reactive({
  processResults: [{required: true, message: '处理结果不能为空', trigger: 'blur'}]
});

const rule2 = reactive({
  content: [{required: true, message: '举报内容不能为空', trigger: 'blur'}]
});

/**
 * 查询
 */
function handleQuery() {
  loading.value = true;
  if (roles.includes("ROOT")) {
    console.log(queryParams.status)
    if (queryParams.status === '') {
      getComplaintsListApi()
        .then(({data}) => {
          console.log(data)
          complaintsList.value = data.complaintsList;
        })
        .finally(() => {
          loading.value = false;
        });
    } else {
      getComplaintsByStatusApi(queryParams.status)
        .then(({data}) => {
          console.log(data)
          complaintsList.value = data.complaintsList;
        })
        .finally(() => {
          loading.value = false;
        });
    }

  } else {
    if (queryParams.status === '') {
      userGetComplaintsApi()
        .then(({data}) => {
          console.log(data)
          complaintsList.value = data.complaintsList;
        })
        .finally(() => {
          loading.value = false;
        })
    } else {
      userGetComplaintsByStatusApi(queryParams.status).then(({data}) => {
        console.log(data)
        complaintsList.value = data.complaintsList;
      })
        .finally(() => {
          loading.value = false;
        });
    }
  }
}

/**
 * 重置查询
 */
function resetQuery() {
  queryFormRef.value.resetFields();
  handleQuery();
}

/**
 * 行checkbox change事件
 */
function handleSelectionChange(selection: any) {
  ids.value = selection.map((item: any) => item.id);
}

/**
 * 打开弹窗
 *
 * @param complaintsId
 */
async function openDialog(complaintsId?: number) {
  dialog.visible = true;
  const res = await getComplaintsApi(complaintsId)
  console.log(res)
  Object.assign(formData, res.data.complaints)

}

/**
 * 关闭用户弹窗
 */
function closeDialog() {
  dialog.visible = false;
  dialog2.visible = false;
  dialog3.visible = false;
  resetForm();
}

/**
 * 重置表单
 */
function resetForm() {
  formData.id = undefined;
  formData.status = 1;
}

function handleComplain() {
  dialog3.visible = true
  console.log('去投诉')
}

/**
 * 表单提交
 */
function handleSubmit() {
  resFormRef.value.validate((valid: any) => {
    if (valid) {
      loading.value = true;
      adminHandleComplaintsApi(formData2)
        .then(() => {
          ElMessage.success('处理成功');
          closeDialog();
          resetQuery();
        })
        .finally(() => (loading.value = false));

    }
  });
}
async function handleConfirmComplain(){
  complainFormRef.value.validate((valid: any) => {
    if (valid) {
      loading.value = true;
      complainApi(formData3.content)
        .then((res: any) => {
          ElMessage.success(res.message);
          closeDialog();
          resetQuery();
        })
        .finally(() => (loading.value = false));

    }
  });
}
/**
 * 删除用户
 */
function handleDelete(complaintsId: number) {
  ElMessageBox.confirm('确认删除投诉记录?', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(function () {
    deleteComplaintsApi(complaintsId).then(() => {
      ElMessage.success('删除成功');
      resetQuery();
    });
  });
}

function confirmHandle(id: any) {
  dialog2.visible = true
  formData2.id = id
}

onMounted(() => {
  handleQuery(); // 初始化用户列表数据
});
</script>

<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :lg="20" :xs="24">
        <div class="search">
          <el-form ref="queryFormRef" :model="queryParams" :inline="true">
            <el-form-item label="状态" prop="status">
              <el-select
                v-model="queryParams.status"
                placeholder="全部"
                clearable
                style="width: 200px"
              >
                <el-option label="已处理" value="已处理"/>
                <el-option label="待处理" value="待处理"/>
              </el-select>
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="handleQuery"
              >
                <i-ep-search/>
                搜索
              </el-button
              >
              <el-button @click="resetQuery">
                <i-ep-refresh/>
                重置
              </el-button
              >
              <el-button type="danger" @click="handleComplain">
                <i-ep-refresh/>
                我要投诉
              </el-button
              >
            </el-form-item>
          </el-form>
        </div>
        <el-card shadow="never">

          <el-table
            v-loading="loading"
            :data="complaintsList"
            @selection-change="handleSelectionChange"
          >
            <el-table-column
              key="id"
              label="编号"
              align="center"
              prop="id"
              width="100"
            />
            <el-table-column
              key="publishName"
              label="举报者"
              align="center"
              prop="whistleblower"
            />
            <el-table-column
              label="处理者"
              width="120"
              align="center"
              prop="handlers"
            />
            <el-table-column
              label="处理状态"
              width="120"
              align="center"
              prop="processStatus"
            />
            <el-table-column
              label="举报时间"
              align="center"
              prop="createTime"
              width="180"
            ></el-table-column>
            <el-table-column
              label="处理时间"
              align="center"
              prop="processTime"
              width="180"
            ></el-table-column>
            <el-table-column label="操作" fixed="right" width="220">
              <template #default="scope">
                <el-button
                  type="primary"
                  link
                  size="small"
                  @click="openDialog(scope.row.id)"
                >
                  <i-ep-edit/>
                  查看详情
                </el-button
                >
                <el-button
                  type="primary"
                  link
                  size="small"
                  v-if="scope.row.processStatus !== '已处理'"
                  v-hasPerm="['sys:complaints:handle']"
                  @click="confirmHandle(scope.row.id)"
                >
                  <i-ep-edit/>
                  立即处理
                </el-button
                >
                <el-button
                  type="primary"
                  link
                  size="small"
                  v-hasPerm="['sys:complaints:delete']"
                  @click="handleDelete(scope.row.id)"
                >
                  <i-ep-delete/>
                  删除
                </el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>

    <!-- 表单弹窗 -->
    <el-dialog
      title="举报详情"
      v-model="dialog.visible"
      width="600px"
      @close="closeDialog"
    >
      <el-descriptions :column="2">
        <el-descriptions-item label="投诉者ID">{{ formData.comUser }}</el-descriptions-item>
        <el-descriptions-item label="处理者ID">{{ formData.processUser }}</el-descriptions-item>
        <el-descriptions-item label="投诉内容" span="2">{{ formData.content }}</el-descriptions-item>
        <el-descriptions-item label="处理状态">{{ formData.processStatus }}</el-descriptions-item>
        <el-descriptions-item label="处理结果" span="2">{{ formData.processResults || '待处理'}}</el-descriptions-item>
        <el-descriptions-item label="处理时间">
          <el-tag size="small">{{ formData.processTime }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="投诉时间">
          <el-tag size="small">{{ formData.createTime }}</el-tag>
        </el-descriptions-item>
      </el-descriptions>
    </el-dialog>
    <!-- 表单弹窗 -->
    <el-dialog
      title="处理结果"
      v-model="dialog2.visible"
      width="600px"
      append-to-body
      @close="closeDialog"
    >
      <el-form
        ref="resFormRef"
        :model="formData2"
        :rules="rules"
        label-width="80px"
      >
        <el-form-item label="处理结果" prop="processResults">
          <el-input
            v-model="formData2.processResults"
            placeholder="请输入处理结果"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="handleSubmit">确 定</el-button>
          <el-button @click="closeDialog">取 消</el-button>
        </div>
      </template>
    </el-dialog>    <!-- 表单弹窗 -->
    <el-dialog
      title="举报内容"
      v-model="dialog3.visible"
      width="600px"
      append-to-body
      @close="closeDialog"
    >
      <el-form
        ref="complainFormRef"
        :model="formData3"
        :rules="rule2"
        label-width="80px"
      >
        <el-form-item label="举报内容" prop="content">
          <el-input
            v-model="formData3.content"
            placeholder="请输入举报内容"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="handleConfirmComplain">确 定</el-button>
          <el-button @click="closeDialog">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
