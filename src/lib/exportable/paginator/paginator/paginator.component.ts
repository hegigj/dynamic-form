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

  pagesPaginator: number[];
  paginatorSub: Subscription;
  languageMap: {[key: string]: any};

  constructor() {
    this.color = 'accent';
    this.language = this.language ? this.language : 'en';
    this.buttons = this.buttons ? this.buttons : [
      {
        type: 'icon',
        text: 'thumb_up',
        tooltip: 'LIKE'
      },
      {
        type: 'outlined-btn',
        text: 'Print page'
      },
      {
        type: 'btn',
        text: 'Print all',
        disabled: true
      }
    ];
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
    this._movePagesPaginator();
    this.metaPaginator.emit(this.params);
  }

  paginator(move: number) {
    if (move === 1) {
      this.params.pageNo = (this.params.pageNo === this.params.totalPages ? this.params.totalPages : (this.params.pageNo + 1));
      this._movePagesPaginator();
    } else {
      this.params.pageNo = (this.params.pageNo === 1 ? this.params.pageNo : (this.params.pageNo - 1));
      this._movePagesPaginator();
    } this.metaPaginator.emit(this.params);
  }

  lastPage() {
    this.params.pageNo = this.params.totalPages;
    this._movePagesPaginator(true);
    this.metaPaginator.emit(this.params);
  }

  private _pagePaginatorGenerator(startIndex: number = 1) {
    this.pagesPaginator = [];
    for (let p = startIndex;
         p <= (this.params.totalPages <= this.maxPages || startIndex !== 1 ? this.params.totalPages : this.maxPages);
         p++) {
      this.pagesPaginator.push(p);
    }
  }

  private _pagePaginatorChanges() {
    this.paginatorSub = this.page.change.subscribe((page: any) => {
      if (page) {
        this.params.pageNo = page.value;
        this.metaPaginator.emit(this.params);
        this._movePagesPaginator();
      }
    });
  }

  private _movePagesPaginator(lastPage: boolean = false) {
    if (this.params.totalPages > this.maxPages) {
      if ((lastPage ? true : (this.params.pageNo === this.pagesPaginator[this.pagesPaginator.length - 1])) &&
        (lastPage ? true : (this.params.pageNo !== this.params.totalPages))) {
        this._pagePaginatorGenerator(this.pagesPaginator[this.pagesPaginator.length - 1]);
      } else if (this.params.pageNo === this.pagesPaginator[0]) {
        this._pagePaginatorGenerator();
      }
    }
  }
}
