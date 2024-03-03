<template>
  <v-chart class="chart" :option="option" autoresize />
</template>
  
<script setup>
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { LineChart } from 'echarts/charts';
import { TooltipComponent, GridComponent } from 'echarts/components';
import VChart from 'vue-echarts';
import { onMounted, ref } from 'vue';

use([CanvasRenderer, LineChart, TooltipComponent, GridComponent]);

const props = defineProps(['data'])

const option = ref({
  tooltip: {
    trigger: 'axis',
    formatter: function (params) {
      const categoryName = params[0].axisValue;
      const value = params[0].data;

      return `
          <div class="tooltip-line-chart-wrapper">
            <p class="date">${categoryName}</p> 
            <div class="value-wrapper">
              <span style="width: 10px; height: 10px; border-radius: 100%; background-color: #1C64F2;"></span>
              <p style="font-weight: bold;">R$ ${value}</p>
            </div>
          </div>
        `;
    },
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: ['Category 1', 'Category 2', 'Category 3', 'Category 4', 'Category 5'],
  },
  yAxis: {
    type: 'value',
  },
  series: [
    {
      name: 'Minha Linha',
      type: 'line',
      smooth: true,
      data: [120, 132, 101, 134, 90],
      emphasis: {
        focus: 'series',
      },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(28, 100, 242, 0.2)' },
            { offset: 1, color: 'rgba(255, 255, 255, 0.0001)' },
          ],
        },
      },
    },
  ],
}); 

onMounted(() => {
  console.log('data', props.data);
  const dates = props.data.filter(item => item.date)
  console.log('dates', dates)
});
</script>
  
<style scoped>
.chart {
  height: 400px;
}
</style>
  