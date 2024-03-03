<template>
  <div style="width: 100%; height: 500px;">
    <v-chart class="chart" :option="option" autoresize />
  </div>
</template>

<script>
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { LineChart } from 'echarts/charts';
import { TooltipComponent, GridComponent } from 'echarts/components';
import VChart from 'vue-echarts';
import { onMounted, ref } from 'vue';

use([CanvasRenderer, LineChart, TooltipComponent, GridComponent]);

export default {
  components: {
    LineChart,
    VChart
  },
  props: {
    data: {
      type: Object,
      defaut: {
        labels: [],
        values: []
      }
    }
  },
  setup(props) {
    const formatedDateLabels = ref([])
    const formatedDateTooltip = ref([])

    onMounted(() => {
      if (props.data.labels) {
        formatedDateLabels.value = props.data.labels.map(date => {
          return formatDateLabels(date).replace('.', '');
        })

        formatedDateTooltip.value = props.data.labels.map(date => {
          return formatDateTooltip(date);
        })
      }
    })

    const formatDateLabels = (dataString) => {
      const dateObj = new Date(dataString);
      const day = dateObj.getDate();
      const mon = dateObj.toLocaleDateString('pt-BR', { month: 'short' });
      return `${day} ${mon}`;
    }

    function formatDateTooltip(dataString) {
      const dataObj = new Date(dataString);
      const options = { day: 'numeric', month: 'long', year: 'numeric' };

      return dataObj.toLocaleDateString('pt-BR', options);
    }

    const option = ref({
      tooltip: {
        trigger: 'axis',
        formatter: function (params) {
          const date = params[0].axisValue;
          const value = params[0].data;
          
          const dataObj = new Date(date);
          const options = { day: 'numeric', month: 'long', year: 'numeric' };

          const formattedDate = dataObj.toLocaleDateString('pt-BR', options);
          const formattedValue = `${value} mi`;

          return `
            <div class="tooltip-line-chart-wrapper">
              <p class="date">${formattedDate}</p> 
              <div class="value-wrapper">
                <span style="width: 10px; height: 10px; border-radius: 100%; background-color: #1C64F2;"></span>
                <p style="font-weight: bold;">R$ ${formattedValue}</p>
              </div>
            </div>
          `;
        },
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: formatedDateLabels,
        axisLabel: {
          formatter: '{value}',
        },
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          formatter: '{value} mi',
        },
      },
      series: [
        {
          name: 'Minha Linha',
          type: 'line',
          smooth: true,
          data: props.data.values,
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

    return {
      option,
    };
  },
};
</script>
