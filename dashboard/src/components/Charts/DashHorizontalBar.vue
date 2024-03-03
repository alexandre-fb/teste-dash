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
      const formatedDateLabels = ref([]);
      const formatedDateTooltip = ref([]);
  
      onMounted(() => {
        if (props.data.labels) {
          formatedDateLabels.value = props.data.labels.map(date => {
            return formatDateLabels(date).replace('.', '');
          });
  
          formatedDateTooltip.value = props.data.labels.map(date => {
            return formatDateTooltip(date);
          });
        }
      });
  
      const formatDateLabels = (dataString) => {
        const dateObj = new Date(dataString);
        const day = String(dateObj.getDate()).padStart(2, '0');
        const mon = dateObj.toLocaleDateString('pt-BR', { month: 'short' });
        return `${day} ${mon}`;
      };
  
      function formatDateTooltip(dataString) {
        const dataObj = new Date(dataString);
        const options = { day: 'numeric', month: 'long', year: 'numeric' };
        return dataObj.toLocaleDateString('pt-BR', options);
      }
  
      const option = ref({
        tooltip: {
          trigger: 'axis',
          formatter: function (params) {
            const index = params[0].dataIndex;
            const value = params[0].data;
  
            const formattedDate = formatedDateTooltip.value[index];
            const formattedValue = `R$ ${value}mi`;
  
            return `
              <div class="tooltip-line-chart-wrapper">
                <p class="date">${formattedDate}</p> 
                <div class="value-wrapper">
                  <span style="width: 10px; height: 10px; border-radius: 100%; background-color: #1C64F2;"></span>
                  <p style="font-weight: bold;">${formattedValue}</p>
                </div>
              </div>
            `;
          },
        },
        xAxis: {
          type: 'value',
          position: 'top',
          boundaryGap: false,
          axisLabel: {
            formatter: '{value} mi',
          },
        },
        yAxis: {
          type: 'category',
          data: formatedDateLabels,
          axisLabel: {
            interval: 0,
            rotate: 30,
          },
        },
        series: [
          {
            name: 'Minha Linha',
            type: 'bar',
            barWidth: '60%',
            data: props.data.values,
            emphasis: {
              focus: 'series',
            },
            itemStyle: {
              color: '#1C64F2',
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
  