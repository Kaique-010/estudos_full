from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.services.cliente_service import ClienteService
from app.schemas.cliente import ClienteCreate, ClienteUpdate, ClienteResponse


router_router = APIRouter()

@router_router.post("/clientes", response_model=ClienteResponse)
def criar_cliente(cliente: ClienteCreate, db: Session = Depends(get_db)):
    try:
        return ClienteService.criar_cliente(dados=cliente, db=db)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router_router.get("/clientes", response_model=list[ClienteResponse])
def listar_clientes(db: Session = Depends(get_db)):
    return ClienteService.listar_clientes(db=db)


@router_router.get("/clientes/{id}", response_model=ClienteResponse)
def buscar_cliente(id: int, db: Session = Depends(get_db)):
    try:
        return ClienteService.buscar_cliente_por_id(db=db, cliente_id=id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router_router.put("/clientes/{id}", response_model=ClienteResponse)
def atualizar_cliente(
    id: int,
    cliente: ClienteUpdate,
    db: Session = Depends(get_db)
):
    try:
        cliente_db = ClienteService.buscar_cliente_por_id(db=db, cliente_id=id)
        return ClienteService.atualizar_cliente(
            dados=cliente,
            db=db,
            cliente=cliente_db
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router_router.delete("/clientes/{id}", status_code=204)
def excluir_cliente(id: int, db: Session = Depends(get_db)):
    try:
        cliente_db = ClienteService.buscar_cliente_por_id(db=db, cliente_id=id)
        ClienteService.deletar_cliente(db=db, cliente=cliente_db)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
