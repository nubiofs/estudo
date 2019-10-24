import { Component, OnInit, ViewChild } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AgGridAngular } from "ag-grid-angular";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnInit {
  @ViewChild("agGrid") agGrid: AgGridAngular;
  title = "app";
  private multiSortKey;

  //Versão com filtro:
  columnDefs = [
    {
      headerName: "Make",
      field: "make",
      sortable: true,
      filter: true,
      checkboxSelection: true
    },
    { headerName: "Model", field: "model", sortable: true, filter: true },
    { headerName: "Price", field: "price", sortable: true, filter: true }
  ];

  //Versão com agrupamento (em html: [autoGroupColumnDef]="autoGroupColumnDef"):
  /*
  columnDefs = [
    { headerName: "Make", field: "make", rowGroup: true },
    { headerName: "Price", field: "price" }
  ];
  autoGroupColumnDef = {
    headerName: "Model",
    field: "model",
    cellRenderer: "agGroupCellRenderer",
    cellRendererParams: {
      checkbox: true
    }
  };
  */

  /*
  rowData = [
    { make: "Toyota", model: "Celica", price: 35000 },
    { make: "Ford", model: "Mondeo", price: 32000 },
    { make: "Porsche", model: "Boxter", price: 72000 }
  ];
  */
  rowData: any;

  constructor(private http: HttpClient) {
    this.multiSortKey = "ctrl";
  }

  ngOnInit() {
    this.rowData = this.http.get("https://api.myjson.com/bins/15psn9");
    //this.rowData = this.http.get("https://api.myjson.com/bins/ly7d1");
  }

  getSelectedRows() {
    const selectedNodes = this.agGrid.api.getSelectedNodes();
    const selectedData = selectedNodes.map(node => node.data);
    const selectedDataStringPresentation = selectedData
      .map(node => node.make + " " + node.model)
      .join(", ");
    alert(`Selected nodes: ${selectedDataStringPresentation}`);
  }

}
