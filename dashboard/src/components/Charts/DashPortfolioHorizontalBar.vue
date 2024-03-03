<template>
  <div style="width: 100%; height: 500px;">
    <v-chart class="chart" :option="option" autoresize />
  </div>
</template>
  
<script>
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { BarChart } from 'echarts/charts';
import { TooltipComponent, GridComponent } from 'echarts/components';
import VChart from 'vue-echarts';
import { onMounted, ref } from 'vue';

use([CanvasRenderer, BarChart, TooltipComponent, GridComponent]);

export default {
  components: {
    VChart
  },
  props: {
    data: {
      type: Object,
      default: {
        labels: [],
        values: []
      }
    }
  },
  setup(props) {

    onMounted(() => {
    });


    const option = ref({
      xAxis: {
        type: 'value',
        position: 'bottom',
        boundaryGap: false,
      },
      yAxis: {
        type: 'category',
        data: props.data.labels,
      },
      series: [
        {
          name: 'Minha Linha',
          type: 'bar',
          barWidth: '60%',
          data: props.data.values,
          emphasis: {
            focus: 'series',
            itemStyle: {
              opacity: 0.85,
            },
            animation: true,
          },
          itemStyle: {
            color: '#1C64F2',
            cursor: 'pointer'
          },
        },
      ],
    });

    return {
      option,
    };
  },
};
</script>
  