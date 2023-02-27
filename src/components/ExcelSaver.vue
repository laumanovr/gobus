<template>
  <div>
    <v-btn color="success" @click="$emit('onClick')">Экспорт в Excel</v-btn>
  </div>
</template>

<script>
import * as ExcelJS from 'exceljs';
import {saveAs} from 'file-saver';
export default {
	props: {
		generalHeaders: Array,
		generalRows: Array,
		mainHeaders: Array,
		mainRows: Array,
		name: String
	},
	methods: {
		exportExcel(e, sheetName = 'Sheet') {
			const workbook = new ExcelJS.Workbook();
			workbook.creator = 'Go Bus Team';
			workbook.created = new Date();
			workbook.modified = new Date();
			workbook.lastPrinted = new Date();
			const worksheet = workbook.addWorksheet(`${sheetName}`, {
				pageSetup: {paperSize: 8, orientation: 'landscape'}
			});
			const bodyBorder = {
				top: {style: 'thin'},
				left: {style: 'thin'},
				bottom: {style: 'thin'},
				right: {style: 'thin'}
			};
			const bodyAlignment = {vertical: 'middle', horizontal: 'center', wrapText: true};
			worksheet.addRow(this.generalHeaders);
			worksheet.getRow(1).font = {size: 12, bold: true};
			worksheet.getRow(1).alignment = bodyAlignment;
			worksheet.getRow(1).height = 38;
			worksheet.getRow(1).eachCell({includeEmpty: true}, cell => {
				cell.border = bodyBorder;
			});
			worksheet.addRows(this.generalRows);
			this.generalHeaders.forEach((i, index) => {
				worksheet.getColumn(index + 1).width = 25;
			});

			worksheet.addRow([]);
			worksheet.addRow(this.mainHeaders);
			worksheet.getRow(4).font = {size: 12, bold: true};
			worksheet.getRow(4).alignment = bodyAlignment;
			worksheet.getRow(4).height = 38;
			worksheet.getRow(4).eachCell({includeEmpty: true}, cell => {
				cell.border = bodyBorder;
			});
			worksheet.addRows(this.mainRows);
			this.mainHeaders.forEach((i, index) => {
				worksheet.getColumn(index + 1).width = 25;
			});
			worksheet.eachRow({includeEmpty: true}, (row, rowNumber) => {
				if (rowNumber > 4) {
					row.height = 32;
					row.font = {size: 11};
				}
				row.eachCell({includeEmpty: true}, (cell) => {
					cell.border = bodyBorder;
					cell.alignment = bodyAlignment;
				});
			});
			workbook.xlsx.writeBuffer().then((data) => {
				let blob = new Blob([data], {type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"});
				saveAs(blob, `Учет,${this.name}.xlsx`);
			});
		}
	}
};
</script>
