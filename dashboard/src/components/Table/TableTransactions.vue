<template>
    <div>
      <el-table :data="paginatedData" stripe style="width: 100%;" :header-cell-style="{ background: '#F9FAFB' }">
        <el-table-column prop="name" label="Cliente" />
        <el-table-column prop="date" label="Data" :formatter="formatterData" />
        <el-table-column prop="value" label="Valor">
          <template #default="scope">
            <span style="font-weight: bold;">{{ formatterValue(scope.row.value) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="type" label="Tipo">
          <template #default="scope">
            <span>{{ scope.row.type }}</span>
          </template>
        </el-table-column>
      </el-table>
  
      <div>
        <el-pagination layout="prev, pager, next" :total="total" :page-size="pageSize" @current-change="updatePaginatedData" />
      </div>
    </div>
  </template>
  
  <script>
  import { ref, onMounted, watch } from 'vue';
  
  export default {
    props: {
      data: {
        type: Array,
        default: [],
      },
    },
  
    setup(props) {
      const total = ref(0);
      const pageSize = ref(6);
      const currentPage = ref(1);
  
      const paginatedData = ref([]);

      const updatePaginatedData = (newPage) => {
        if(newPage > 0) {
          currentPage.value = newPage
        } 
        const startIndex = (currentPage.value - 1) * pageSize.value;
        const endIndex = startIndex + pageSize.value;
        paginatedData.value = props.data.slice(startIndex, endIndex);
      };
  
      const formatterData = (row) => {
        const dataObj = new Date(row.date);
        const options = { day: 'numeric', month: 'long', year: 'numeric' };
        return dataObj.toLocaleDateString('pt-BR', options);
      };
  
      const formatterValue = (value) => {
        const formattedValue = value.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        });
        return formattedValue;
      };
  
  
      onMounted(() => {
        total.value = props.data.length;
        updatePaginatedData();
      });
  
      return {
        paginatedData,
        formatterData,
        formatterValue,
        pageSize,
        total,
        updatePaginatedData
      };
    },
  };
  </script>
  