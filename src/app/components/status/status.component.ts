import { Component, Output, EventEmitter, Input, OnInit } from '@angular/core';
import { TableDataSource, ValidatorService } from 'angular4-material-table';
import { RconService } from '../../services/rcon.service';
import { RconServerInfo } from '../../interfaces/serverinfo.rcon';
import {RconServerInfoValidatorService} from '../../services/rcon-server-info-validator.service';

@Component({
  selector: 'app-status',
  providers: [
    {provide: ValidatorService, useClass: RconServerInfoValidatorService }
  ],
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.css']
})
export class StatusComponent implements OnInit {
  rconServerInfo: RconServerInfo[]  = [];

  @Output() RconServerInfoListChange = new EventEmitter<RconServerInfo[]>();
  // @Input() rconServerInfo = [
  //   { name: '', value: '' },
  // ] ;

  constructor(
    private rcon: RconService,
    private RconServerInfoValidator: ValidatorService
  ) {
    this.RconServerInfoListChange.subscribe(data => {
      console.log(data);
    })
  }

  displayedColumns = ['name', 'value', 'actionsColumn'];
  dataSource: TableDataSource<RconServerInfo>;

  ngOnInit() {
    this.rcon.getServerInfo().subscribe(serverInfo => {
      this.rconServerInfo = serverInfo;
      this.dataSource.updateDatasource(serverInfo, { emitEvent: false });
    } );
    //this.dataSource.confirmCreate((row: RconServerInfo)=>{});

    this.dataSource = new TableDataSource<RconServerInfo>(this.rconServerInfo, RconServerInfo, this.RconServerInfoValidator);
    this.dataSource.datasourceSubject.subscribe(RconServerInfoList => this.RconServerInfoListChange.emit(RconServerInfoList));
  }



}
