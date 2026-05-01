import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { OilService, EssentialOil } from '../../oil.service';
import { OilCartOrderComponent } from "../../oil-cart-order/oil-cart-order.component";
import { ImageUrlPipe } from '../../pipes/image-url.pipe';

@Component({
  selector: 'app-oil',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, OilCartOrderComponent, ImageUrlPipe],
  templateUrl: './oil.component.html',
  styleUrls: ['./oil.component.scss']   // 注意：使用 styleUrls，不是 styleUrl
})
export class OilComponent implements OnInit {
  oil: EssentialOil | null = null;
  quantity = 1;
  loading = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private oilService: OilService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.loading = true;
      this.oilService.getOilById(id).subscribe({
        next: (data) => {
          this.oil = data;
          this.loading = false;
        },
        error: () => {
          this.loading = false;
          this.oil = null;
        }
      });
    }
  }

  addToCart(): void {
  if (!this.oil) return;

  const userId = localStorage.getItem('userId');
  if (!userId) {
    alert('請先登入再購買');
    this.router.navigateByUrl('/login');
    return;
  }

  this.oilService.addToCart(this.oil, this.quantity);
  alert('已加入購物車');
}
}
