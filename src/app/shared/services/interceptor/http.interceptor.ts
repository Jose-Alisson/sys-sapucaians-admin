import { HttpInterceptorFn } from '@angular/common/http';

export const httpInterceptor: HttpInterceptorFn = (req, next) => {
 
  const modifiedReq = req.clone({
    headers: req.headers.set('Access-Control-Allow-Origin', '*')
  });

  return next(modifiedReq);
};
