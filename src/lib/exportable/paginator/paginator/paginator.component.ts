import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild} from '@angular/core';
import {MatButtonToggleGroup} from '@angular/material';
import {Subscription} from 'rxjs';

declare type Lang = 'en' | 'it' | 'sq';
interface Params {
  pageNo: number;
  pageSize: number;
  totalPages: number;
  totalRecords: number;
}
declare type ButtonType = 'icon' | 'btn' | 'raised-btn' | 'outlined-btn';
export interface Buttons {
  type: ButtonType;
  text: string;
  tooltip?: string;
  click?: Function;
  clickParams?: string | number | boolean;
  disabled?: boolean;
}

@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.css']
})
export class PaginatorComponent implements OnInit, OnChanges, OnDestroy {
  @Input() color: string;
  @Input() language: Lang;

  @Input() buttons: Buttons[];
  @Input() params: Params;
  @Input() showRecordsPerPage: number[];
  @Input() maxPages: number;

  @ViewChild('pages') page: MatButtonToggleGroup;
  @Output() metaPaginator: EventEmitter<Params> = new EventEmitter<Params>();

  previousBtnDisabled: boolean;
  firstPageNo: number;
  pagesPaginator: number[];
  lastPageNo: number;
  nextBtnDisabled: boolean;

  paginatorSub: Subscription;
  languageMap: {[key: string]: any};

  constructor() {
    this.color = 'accent';
    this.language = this.language ? this.language : 'en';
    this.languageMap = {
      en: {
        firstPage: 'First Page',
        prevPage: 'Previous Page',
        nextPage: 'Next Page',
        lastPage: 'Last Page',
        recordsPerPage: 'Show record per page',
        of: 'of'
      },
      it: {
        firstPage: 'Prima pagina',
        prevPage: 'Pagina precedente',
        nextPage: 'Pagina successiva',
        lastPage: 'L\'ultima Page',
        recordsPerPage: 'Mostra record per pagina',
        of: 'da'
      },
      sq: {
        firstPage: 'Faqja e parë',
        prevPage: 'Faqja paraardhëse',
        nextPage: 'Faqja pasardhëse',
        lastPage: 'Faqja e fundit',
        recordsPerPage: 'Shfaq rreshta për faqe',
        of: 'nga'
      },
    };
    this.showRecordsPerPage = this.showRecordsPerPage ? this.showRecordsPerPage : [6, 12, 24];
    this.maxPages = this.maxPages ? this.maxPages : 6;
    this.params = this.params ? this.params : {
      pageNo: 1,
      pageSize: 6,
      totalPages: 3,
      totalRecords: 18
    };
    this.lastPageNo = this.maxPages;
    this.firstPageNo = 1;
  }

  ngOnInit() {
    this._pagePaginatorGenerator();
    this._pagePaginatorChanges();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.params.previousValue && changes.params.currentValue.pageSize !== changes.params.previousValue.pageSize) {
      this._pagePaginatorGenerator();
    }
  }

  ngOnDestroy() {
    this.paginatorSub.unsubscribe();
  }

  click(index: number) {
    if (this.buttons && this.buttons[index].click) {
      if (this.buttons[index].clickParams) {
        this.buttons[index].click(this.buttons[index].clickParams);
      } else {
        this.buttons[index].click();
      }
    }
  }

  displayRecords(size: number) {
    this.params.pageNo = 1;
    this.params.pageSize = size;
    this._pagePaginatorGenerator();
    this.metaPaginator.emit(this.params);
  }

  firstPage() {
    this.params.pageNo = 1;
    this.firstPageNo = this.params.pageNo;
    this.lastPageNo = this.params.totalPages >= this.maxPages ? this.maxPages : this.params.totalPages;
    this.metaPaginator.emit(this.params);
    this._disablePaginatorButtons();
  }

  paginator(move: number) {
    if (move === 1) {
      this.params.pageNo = (this.params.pageNo === this.params.totalPages ? this.params.pageNo : (this.params.pageNo + 1));
    } else {
      this.params.pageNo = (this.params.pageNo === 1 ? this.params.pageNo : (this.params.pageNo - 1));
    }
    this._adjustFPandLP();
    this.metaPaginator.emit(this.params);
    this._disablePaginatorButtons();
  }

  lastPage() {
    this.params.pageNo = this.params.totalPages;
    this.lastPageNo = this.params.pageNo;
    this.firstPageNo = this.lastPageNo - (this.params.totalPages >= this.maxPages ? this.maxPages : this.params.totalPages) - 1;
    this.metaPaginator.emit(this.params);
    this._disablePaginatorButtons();
  }

  private _adjustFPandLP() {
    this.firstPageNo = this.params.pageNo;
    if (this.firstPageNo + (this.params.totalPages >= this.maxPages ? this.maxPages : this.params.totalPages) - 1 > this.params.totalPages) {
      this.lastPageNo = this.params.pageNo;
      this.firstPageNo = this.lastPageNo - (this.params.totalPages >= this.maxPages ? this.maxPages : this.params.totalPages) - 1;
    } else {
      this.lastPageNo = this.firstPageNo + (this.params.totalPages >= this.maxPages ? this.maxPages : this.params.totalPages) - 1;
    } this._pagePaginatorGenerator(true);
  }

  private _pagePaginatorGenerator(move?: boolean) {
    this.pagesPaginator = [];

    if (!move) {
      if (this.params.totalPages >= this.maxPages) {
        this.lastPageNo = this.maxPages;
      } else if (this.params.totalPages < this.maxPages) {
        this.lastPageNo = this.params.totalPages;
      }
    }

    for (let page = this.firstPageNo; page <= this.lastPageNo; page++) {
      this.pagesPaginator.push(page);
    }
  }

  private _pagePaginatorChanges() {
    this.paginatorSub = this.page.change.subscribe((page: any) => {
      if (page) {
        this.params.pageNo = page.value;
        this._disablePaginatorButtons();
        this.metaPaginator.emit(this.params);
      }
    });
  }

  private _disablePaginatorButtons() {
    if (this.params.pageNo === 1) {
      this.previousBtnDisabled = true;
    } if (this.params.pageNo > 1) {
      this.previousBtnDisabled = false;
    } if (this.params.pageNo < this.params.totalPages) {
      this.nextBtnDisabled = false;
    } if (this.params.pageNo === this.params.totalPages) {
      this.nextBtnDisabled = true;
    }
  }
}
