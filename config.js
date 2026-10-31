// === EDITA AQUÍ TUS DATOS ===
const CONFIG={
  tienda:"Farmanova",
  whatsapp:"15551234567", // número con código de país, sin + ni espacios (ej. 5215512345678)
  moneda:"$",
  envio:4.5,          // costo de envío
  envioGratisDesde:35,
  direccion:"Tu dirección, ciudad",
  horario:"Lun–Sáb 9:00–20:00",
  transfermovil:{
    qr:"img/qr-transfermovil.svg",   // reemplaza por tu QR real (png/jpg/svg) y cambia esta ruta
    enlace:"https://example.com/pago-prueba", // enlace que abre el botón «Ir a Transfermóvil» (el mismo que codifica tu QR)
    titular:"Nombre del titular",
    cuenta:"0000 0000 0000 0000"
  },
  supabase:{          // base de datos (ver supabase.sql y LEEME.txt). Déjalo vacío para no guardar pedidos.
    url:"",           // ej. https://abcdxyz.supabase.co
    anonKey:""        // clave "anon public" del proyecto
  },
  email:"contacto@tufarmacia.com"
};
