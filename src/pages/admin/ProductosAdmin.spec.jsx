import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ProductosAdmin from "./ProductosAdmin";
import { productosService } from "../../services/productosService";
vi.mock("../../services/productosService",()=>({productosService:{listar:vi.fn(),eliminar:vi.fn()}}));
const datos=[{id:"1",codigo:"LUX001",nombre:"Turathi Blue",marca:"Afnan",precio:28000,stock:10,stockCritico:2,categoria:"moderados",ml:90},{id:"2",codigo:"LUX002",nombre:"9pm",marca:"Afnan",precio:25000,stock:1,stockCritico:2,categoria:"intensos",ml:100}];
describe("ProductosAdmin",()=>{beforeEach(()=>{vi.clearAllMocks();productosService.listar.mockResolvedValue(datos)});it("filtra el listado al escribir en la búsqueda",async()=>{render(<MemoryRouter><ProductosAdmin/></MemoryRouter>);expect(await screen.findByText("Turathi Blue")).toBeInTheDocument();fireEvent.change(screen.getByLabelText("Buscar producto"),{target:{value:"9pm"}});await waitFor(()=>expect(screen.getByText("9pm")).toBeInTheDocument());expect(screen.queryByText("Turathi Blue")).not.toBeInTheDocument();});});
