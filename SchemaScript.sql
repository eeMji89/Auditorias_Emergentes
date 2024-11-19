-- This script was generated by the ERD tool in pgAdmin 4.
-- Please log an issue at https://github.com/pgadmin-org/pgadmin4/issues/new/choose if you find any bugs, including reproduction steps.
BEGIN;


CREATE TABLE IF NOT EXISTS public."AUDITOR"
(
    "ID_Auditor" bigint NOT NULL,
    "Nombre_Auditor" "char" NOT NULL,
    "Telefono_Auditor" bigint NOT NULL,
    "Especializacion" "char" NOT NULL,
    "Certificaciones" "char" NOT NULL,
    "ID_Usuario" bigint NOT NULL,
    CONSTRAINT "AUDITOR_pkey" PRIMARY KEY ("ID_Auditor")
);

CREATE TABLE IF NOT EXISTS public."AUDITORIA"
(
    "ID_Auditoria" bigint NOT NULL,
    "ID_Empresa" bigint NOT NULL,
    "ID_Auditor" bigint NOT NULL,
    "Fecha" date NOT NULL,
    "Estatus" "char" NOT NULL,
    "Descripcion" "char" NOT NULL,
    "Salario" money NOT NULL,
    "Horas_Extra" smallint NOT NULL,
    "Seguro" boolean NOT NULL,
    "Vacaciones" boolean NOT NULL,
    "Documentacion" json NOT NULL,
    "Comentarios" text COLLATE pg_catalog."default",
    CONSTRAINT "Auditoria_pkey" PRIMARY KEY ("ID_Auditoria")
);

CREATE TABLE IF NOT EXISTS public."CONTRATO"
(
    "ID_Contrato" bigint NOT NULL,
    "ID_Auditoria" bigint NOT NULL,
    "Fecha" date NOT NULL,
    "Validacion" "char" NOT NULL,
    CONSTRAINT "CONTRATO_pkey" PRIMARY KEY ("ID_Contrato")
);

CREATE TABLE IF NOT EXISTS public."EMPRESA"
(
    "ID_Empresa" bigint NOT NULL,
    "Nombre_Empresa" "char" NOT NULL,
    "Tipo" "char" NOT NULL,
    "No_Registro" smallint NOT NULL,
    "Ubicacion" "char" NOT NULL,
    "Nombre_Representante" "char" NOT NULL,
    "Cargo_Representante" "char" NOT NULL,
    "ID_Usuario" bigint NOT NULL,
    CONSTRAINT "EMPRESA_pkey" PRIMARY KEY ("ID_Empresa")
);

CREATE TABLE IF NOT EXISTS public."SOLICITUD"
(
    "ID_Solicitud" bigint NOT NULL,
    "ID_Empresa" bigint NOT NULL,
    "ID_Auditor" bigint NOT NULL,
    "Fecha" date NOT NULL,
    "Detalles" text COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT "SOLICITUD_pkey" PRIMARY KEY ("ID_Solicitud")
);

CREATE TABLE IF NOT EXISTS public."USUARIO"
(
    "ID_Usuario" bigint NOT NULL,
    "Nombre_Usuario" "char" NOT NULL,
    "Contraseña" "char" NOT NULL,
    "Rol" "char" NOT NULL,
    "Pais" "char" NOT NULL,
    "Telefono" bigint NOT NULL,
    "Correo_Electronico" "char" NOT NULL,
    CONSTRAINT "USUARIO_pkey" PRIMARY KEY ("ID_Usuario")
);

ALTER TABLE IF EXISTS public."AUDITOR"
    ADD CONSTRAINT "ID_Usuario" FOREIGN KEY ("ID_Usuario")
    REFERENCES public."USUARIO" ("ID_Usuario") MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    NOT VALID;


ALTER TABLE IF EXISTS public."AUDITORIA"
    ADD CONSTRAINT "ID_Auditor" FOREIGN KEY ("ID_Auditor")
    REFERENCES public."AUDITOR" ("ID_Auditor") MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;


ALTER TABLE IF EXISTS public."AUDITORIA"
    ADD CONSTRAINT "ID_Empresa" FOREIGN KEY ("ID_Empresa")
    REFERENCES public."EMPRESA" ("ID_Empresa") MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    NOT VALID;


ALTER TABLE IF EXISTS public."CONTRATO"
    ADD CONSTRAINT "ID_Auditoria" FOREIGN KEY ("ID_Auditoria")
    REFERENCES public."AUDITORIA" ("ID_Auditoria") MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;


ALTER TABLE IF EXISTS public."EMPRESA"
    ADD CONSTRAINT "ID_Usuario" FOREIGN KEY ("ID_Usuario")
    REFERENCES public."USUARIO" ("ID_Usuario") MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    NOT VALID;


ALTER TABLE IF EXISTS public."SOLICITUD"
    ADD CONSTRAINT "ID_Auditor" FOREIGN KEY ("ID_Auditor")
    REFERENCES public."AUDITOR" ("ID_Auditor") MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;


ALTER TABLE IF EXISTS public."SOLICITUD"
    ADD CONSTRAINT "ID_Empresa" FOREIGN KEY ("ID_Empresa")
    REFERENCES public."EMPRESA" ("ID_Empresa") MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;

END;