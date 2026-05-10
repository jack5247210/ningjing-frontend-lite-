import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface DialogOptions {
  title?: string;
  message: string;
  type?: 'info' | 'success' | 'error' | 'confirm';
  confirmText?: string;
  cancelText?: string;
}

@Injectable({ providedIn: 'root' })
export class DialogService {
  // 控制对话框是否显示
  private visibleSubject = new BehaviorSubject<boolean>(false);
  public visible$ = this.visibleSubject.asObservable();

  // 当前对话框内容
  private optionsSubject = new BehaviorSubject<DialogOptions>({ message: '' });
  public options$ = this.optionsSubject.asObservable();

  // 用于 confirm 模式返回结果
  private resolveFn: ((value: boolean) => void) | null = null;

  /** 提醒对话框（类似 alert） */
  alert(message: string, title?: string): void {
    this.optionsSubject.next({ message, title: title || '提示', type: 'info' });
    this.visibleSubject.next(true);
  }

  /** 确认对话框（类似 confirm） */
  confirm(message: string, title?: string): Observable<boolean> {
    this.optionsSubject.next({
      message,
      title: title || '确认操作',
      type: 'confirm',
      confirmText: '确定',
      cancelText: '取消'
    });
    this.visibleSubject.next(true);

    return new Observable<boolean>(observer => {
      this.resolveFn = (result: boolean) => {
        observer.next(result);
        observer.complete();
        this.close();
      };
    });
  }

  /** 关闭对话框 */
  close() {
    this.visibleSubject.next(false);
  }

  /** 用户点击确定 */
  confirmAction() {
    if (this.resolveFn) {
      this.resolveFn(true);
      this.resolveFn = null;
    } else {
      this.close();
    }
  }

  /** 用户点击取消 */
  cancelAction() {
    if (this.resolveFn) {
      this.resolveFn(false);
      this.resolveFn = null;
    } else {
      this.close();
    }
  }
}
