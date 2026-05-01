import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { OilService, EssentialOil } from '../../../oil.service';

@Component({
  selector: 'app-manage-oil',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './manage-oil.component.html',
  styleUrls: ['./manage-oil.component.scss']
})
export class ManageOilComponent implements OnInit {
  oils: EssentialOil[] = [];
  filteredOils: EssentialOil[] = [];
  loading = false;
  error = '';

  // 排序相关
  sortColumn = 'oilId';
  sortDirection: 'asc' | 'desc' = 'desc';

  // 筛选相关
  categoryFilter = '';  // 分类筛选
  capacityFilter = '';  // 容量筛选

  // 动态获取所有不重复的分类和容量
  get allCategories(): string[] {
    return [...new Set(this.oils.map(o => o.category).filter(Boolean))];
  }

  get allCapacities(): string[] {
    return [...new Set(this.oils.map(o => o.capacity).filter(Boolean))];
  }

  constructor(private oilService: OilService, private router: Router) {}

  ngOnInit(): void {
    this.loadOils();
  }

  loadOils() {
    this.loading = true;
    this.oilService.getAllOilsForAdmin().subscribe({
      next: (data) => {
        this.oils = data;
        this.applyFilterAndSort();
        this.loading = false;
      },
      error: () => {
        this.error = '載入失敗';
        this.loading = false;
      }
    });
  }

  // ─── 筛选 + 排序 ──────────────────────────────
  applyFilterAndSort() {
    let data = [...this.oils];

    // 按分类筛选
    if (this.categoryFilter) {
      data = data.filter(o => o.category === this.categoryFilter);
    }

    // 按容量筛选
    if (this.capacityFilter) {
      data = data.filter(o => o.capacity === this.capacityFilter);
    }

    // 排序
    data.sort((a: any, b: any) => {
      const valA = a[this.sortColumn];
      const valB = b[this.sortColumn];
      if (typeof valA === 'string') {
        return this.sortDirection === 'asc'
          ? valA.localeCompare(valB)
          : valB.localeCompare(valA);
      } else {
        return this.sortDirection === 'asc' ? valA - valB : valB - valA;
      }
    });

    this.filteredOils = data;
  }

  onFilterChange() {
    this.applyFilterAndSort();
  }

  sort(column: string) {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    this.applyFilterAndSort();
  }

  // ─── 操作 ────────────────────────────────────
  editOil(id: number) {
    this.router.navigate(['/admin/oils/edit', id]);
  }

  deleteOil(id: number) {
    if (confirm('確定刪除此精油？')) {
      this.oilService.deleteOil(id).subscribe({
        next: () => this.loadOils(),
        error: (err) => {
          const msg = err.error?.message || '刪除失敗';
          alert(msg);
        }
      });
    }
  }
}
